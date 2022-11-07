import { Inject, Injectable } from '@nestjs/common';
import { ReportDashboard } from 'src/base/entity/metabase/ReportDashboard';
import { ConfigTag } from 'src/base/entity/platform-config/ConfigTag';
import { DashboardExt } from 'src/base/entity/platform-dashboard/DashboardExt';
import { DashboardFavoriteLog } from 'src/base/entity/platform-dashboard/DashboardFavoriteLog';
import { DashboardForkLog } from 'src/base/entity/platform-dashboard/DashboardForkLog';
import { DashboardShareLog } from 'src/base/entity/platform-dashboard/DashboardShareLog';
import { DashboardViewLog } from 'src/base/entity/platform-dashboard/DashboardViewLog';
import { DashboardTag } from 'src/base/entity/platform-dashboard/DashboradTag';
import { Account } from 'src/base/entity/platform-user/Account.entity';
import { W3Logger } from 'src/base/log/logger.service';
import { RepositoryConsts } from 'src/base/orm/repositoryConsts';
import { Log4ViewDashboardRequest } from 'src/viewModel/dashboard/view/Log4ViewDashboardRequest';
import { MarkTag4DashboardRequest } from 'src/viewModel/dashboard/tag/MarkTag4DashboardRequest';
import { MarkTag4DashboardResponse } from 'src/viewModel/dashboard/tag/MarkTag4DashboardResponse';
import { RemoveTag4DashboardRequest } from 'src/viewModel/dashboard/tag/RemoveTag4DashboardRequest';
import { Repository } from 'typeorm';
import { Log4ViewDashboardResponse } from '../viewModel/dashboard/view/Log4ViewDashboardResponse';
import { RemoveTag4DashboardResponse } from '../viewModel/dashboard/tag/RemoveTag4DashboardResponse';
import { Log4FavoriteDashboardRequest } from 'src/viewModel/dashboard/favorite/Log4FavoriteDashboardRequest';
import { Log4FavoriteDashboardResponse } from 'src/viewModel/dashboard/favorite/Log4FavoriteDashboardResponse';
import { Log4ShareDashboardResponse } from 'src/viewModel/dashboard/share/Log4ShareDashboardResponse';
import { Log4ForkDashboardResponse } from 'src/viewModel/dashboard/fork/Log4ForkDashboardResponse';
import { Log4ShareDashboardRequest } from 'src/viewModel/dashboard/share/Log4ShareDashboardRequest';
import { Log4ForkDashboardRequest } from 'src/viewModel/dashboard/fork/Log4ForkDashboardRequest';
import { OperationEventPayload } from 'src/viewModel/event/OperationEventPayload';
import { OperationEventTopic } from 'src/viewModel/event/OperationEventTopic';

@Injectable()
export class DashboardOperationService {


    logger: W3Logger;

    constructor(

        @Inject(RepositoryConsts.REPOSITORYS_PLATFORM.PLATFORM_ACCOUNT_REPOSITORY.provide)
        private accountRepo: Repository<Account>,

        @Inject(RepositoryConsts.REPOSITORYS_METABASE.MB_REPORT_DASHBOARD_REPOSITORY.provide)
        private mb_rdRepo: Repository<ReportDashboard>,

        @Inject(RepositoryConsts.REPOSITORYS_PLATFORM.PLATFORM_CONFIG_TAG_REPOSITORY.provide)
        private ctagRepo: Repository<ConfigTag>,

        @Inject(RepositoryConsts.REPOSITORYS_PLATFORM.PLATFORM_DASHBOARD_EXT_REPOSITORY.provide)
        private dextRepo: Repository<DashboardExt>,
        @Inject(RepositoryConsts.REPOSITORYS_PLATFORM.PLATFORM_DASHBOARD_FAVORITE_LOG_REPOSITORY.provide)
        private dfavlRepo: Repository<DashboardFavoriteLog>,
        @Inject(RepositoryConsts.REPOSITORYS_PLATFORM.PLATFORM_DASHBOARD_FORK_LOG_REPOSITORY.provide)
        private dforklRepo: Repository<DashboardForkLog>,
        @Inject(RepositoryConsts.REPOSITORYS_PLATFORM.PLATFORM_DASHBOARD_SHARE_LOG_REPOSITORY.provide)
        private dsharelRepo: Repository<DashboardShareLog>,
        @Inject(RepositoryConsts.REPOSITORYS_PLATFORM.PLATFORM_DASHBOARD_VIEW_LOG_REPOSITORY.provide)
        private dviewlRepo: Repository<DashboardViewLog>,
        @Inject(RepositoryConsts.REPOSITORYS_PLATFORM.PLATFORM_DASHBOARD_TAG_REPOSITORY.provide)
        private dtagRepo: Repository<DashboardTag>,
    ) {
        this.logger = new W3Logger(`DashboardOperationService`);
    }

    async logFavorite(request: Log4FavoriteDashboardRequest): Promise<Log4FavoriteDashboardResponse> {

        let resp: Log4FavoriteDashboardResponse = {
            id: 0, msg: ''
        };
        let findRecord = await this.dfavlRepo.findOne({
            where: {
                accountId: request.accountId,
                dashboardId: request.dashboardId
            },

        });
        if (findRecord) {
            resp.id = findRecord.id;
            if (request.operationFlag === "cancel") {
                await this.dfavlRepo.remove(findRecord);
                resp.msg = "cancelFavorite";
            } else {
                resp.msg = "nothing";
            }
        }
        else {
            findRecord = {
                id: 0,
                dashboardId: request.dashboardId,
                accountId: request.accountId,
                createdAt: new Date()
            };
            await this.dfavlRepo.save(findRecord);
            resp.id = findRecord.id;
            resp.msg = "new";
        }

        this.fireEvent({
            topic: OperationEventTopic.logFavorite,
            data: {
                accountId: request.accountId,
                dashboardId: request.dashboardId
            }
        });

        return resp;
    }


    async logView(param: Log4ViewDashboardRequest, accountId: string): Promise<Log4ViewDashboardResponse> {
        let resp: Log4ViewDashboardResponse = {
            id: 0, msg: ''
        };
        let newRecord: DashboardViewLog = {
            id: 0,
            dashboardId: param.dashboardId,
            viewerAccountId: accountId,
            createdAt: new Date(),
            referralCode: param.referralCode
        };
        await this.dviewlRepo.save(newRecord);
        resp.id = newRecord.id;
        resp.msg = "new";

        this.fireEvent({
            topic: OperationEventTopic.logView,
            data: {
                dashboardId: param.dashboardId
            }
        });

        return resp;
    }


    async logShare(param: Log4ShareDashboardRequest, accountId: string): Promise<Log4ShareDashboardResponse> {
        let resp: Log4ShareDashboardResponse = {
            id: 0, msg: ''
        };
        let findExist = await this.dsharelRepo.findOne({
            where: {
                dashboardId: param.dashboardId,
                shareChannel: param.shareChannel,
                referralCode: param.referralCode,
                accountId: accountId,
            }
        });
        if (findExist) {
            resp.id = findExist.id;
            resp.msg = "existing";
        }
        else {
            let newRecord: DashboardShareLog = {
                id: 0,
                dashboardId: param.dashboardId,
                accountId: accountId,
                createdAt: new Date(),
                shareChannel: param.shareChannel,
                referralCode: param.referralCode
            };
            await this.dsharelRepo.save(newRecord);
            resp.id = newRecord.id;
            resp.msg = "new";
        }

        this.fireEvent({
            topic: OperationEventTopic.logShare,
            data: {
                dashboardId: param.dashboardId
            }
        });

        return resp;
    }
    async logFork(param: Log4ForkDashboardRequest, accountId: string): Promise<Log4ForkDashboardResponse> {
        let resp: Log4ForkDashboardResponse = {
            id: 0, msg: ''
        };
        let findExist = await this.dforklRepo.findOne({
            where: {
                accountId: accountId,
                originalDashboardId: param.originalDashboardId,
                forkedDashboardId: param.forkedDashboardId
            }
        });
        if (findExist) {
            resp.id = findExist.id;
            resp.msg = "existing";
        }
        else {
            let newRecord: DashboardForkLog = {
                id: 0,
                originalDashboardId: param.originalDashboardId,
                forkedDashboardId: param.forkedDashboardId,
                accountId: accountId,
                createdAt: new Date(),
            };
            await this.dforklRepo.save(newRecord);
            resp.id = newRecord.id;
            resp.msg = "new";
        }

        this.fireEvent({
            topic: OperationEventTopic.logFork,
            data: {
                dashboardId: param.originalDashboardId
            }
        });

        return resp;
    }


    async removeTags(param: RemoveTag4DashboardRequest, accountId: string): Promise<RemoveTag4DashboardResponse> {

        let resp: RemoveTag4DashboardResponse = {
            msg: ''
        };
        let removedTagIds: number[] = [];
        for (const tagId of param.tagIds) {
            let record = await this.dtagRepo.findOne({
                where: {
                    creator: accountId,
                    dashboardId: param.dashboardId,
                    tagId: tagId
                }
            });
            if (record) {
                await this.dtagRepo.remove(record);
                removedTagIds.push(tagId);
            }
        }
        resp.msg = removedTagIds.join(',');
        return resp;
    }
    async markTags(param: MarkTag4DashboardRequest, accountId: string): Promise<MarkTag4DashboardResponse> {
        let resp: MarkTag4DashboardResponse = {
            msg: ''
        };
        let newTagIds: number[] = [];
        for (const tagId of param.tagIds) {
            let record = await this.dtagRepo.findOne({
                where: {
                    creator: accountId,
                    dashboardId: param.dashboardId,
                    tagId: tagId
                }
            });
            if (!record) {

                let newTag: DashboardTag = {
                    dashboardId: param.dashboardId,
                    tagId: tagId,
                    createdAt: new Date(),
                    creator: accountId
                };
                await this.dtagRepo.save(newTag);
                newTagIds.push(tagId);

            }
        }
        resp.msg = newTagIds.join(',');
        return resp;
    }



    async fireEvent(payload: OperationEventPayload): Promise<any> {
        this.logger.debug(`fireEvent:${JSON.stringify(payload)}`);

        //TODO work with events
    }
}

