import { W3Logger } from "src/base/log/logger.service";
import { OnEvent } from '@nestjs/event-emitter';
import { Inject } from "@nestjs/common";
import { DashboardExt } from "src/base/entity/platform-dashboard/DashboardExt";
import { DashboardFavoriteLog } from "src/base/entity/platform-dashboard/DashboardFavoriteLog";
import { DashboardForkLog } from "src/base/entity/platform-dashboard/DashboardForkLog";
import { DashboardShareLog } from "src/base/entity/platform-dashboard/DashboardShareLog";
import { DashboardViewLog } from "src/base/entity/platform-dashboard/DashboardViewLog";
import { RepositoryConsts } from "src/base/orm/repositoryConsts";
import { Repository } from "typeorm";
import { EventEmitter2 } from '@nestjs/event-emitter'
import { DashboardEventPayload } from "./model/dashboard/DashboardEventPayload";
import { AccountEventPayload } from "./model/account/AccountEventPayload";
import { DashboardEventTopic } from "./model/dashboard/DashboardEventTopic";
import { AccountEventTopic } from "./model/account/AccountEventTopic";
import { Account } from "src/base/entity/platform-user/Account.entity";
import { AccountFollower } from "src/base/entity/platform-user/AccountFollower";
import { Job_SyncDashboardFromMB } from "src/jobs/job.syncDashboardFromMB";
import { ExternalEventPayload } from "./model/external-notify/ExternalEventPayload";
import { ExternalEventTopic } from "./model/external-notify/ExternalEventTopic";
import { DatasetEventPayload } from "./model/dataset/DatasetEventPayload";
import { DatasetEventTopic} from "./model/dataset/DatasetEventTopic";
import { DatasetViewLog } from "src/base/entity/platform-dataset/DatasetViewLog";
import { DatasetExt } from "src/base/entity/platform-dataset/DatasetExt";
import { Job_SyncDatasetFromMB } from "src/jobs/job.syncDatasetFromMB";

export class EventService {

    logger: W3Logger;
    constructor(
        private job_SyncDashboardFromMB: Job_SyncDashboardFromMB,
        private job_SyncDatasetFromMB : Job_SyncDatasetFromMB,
        private eventEmitter: EventEmitter2,

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

        @Inject(RepositoryConsts.REPOSITORYS_PLATFORM.PLATFORM_DATASET_EXT_REPOSITORY.provide)
        private datasetExtRepo: Repository<DatasetExt>,
        @Inject(RepositoryConsts.REPOSITORYS_PLATFORM.PLATFORM_DATASET_VIEW_LOG_REPOSITORY.provide)
        private datasetViewlRepo: Repository<DatasetViewLog>,

        @Inject(RepositoryConsts.REPOSITORYS_PLATFORM.PLATFORM_ACCOUNT_FOLLOWER_REPOSITORY.provide)
        private afRepo: Repository<AccountFollower>,

        @Inject(RepositoryConsts.REPOSITORYS_PLATFORM.PLATFORM_ACCOUNT_REPOSITORY.provide)
        private aRepo: Repository<Account>,
    ) {
        this.logger = new W3Logger(`EventService`);
    }
    async externalEventFired(param: ExternalEventPayload): Promise<any> {
        let resp: any = 'noMatchedTopic';
        if (param.topic) {
            switch (param.topic) {
                case ExternalEventTopic.DashboardChanged:
                    let dashboard_id = Number(param.data.toString());
                    this.logger.debug(`emit syncDashboard events:${dashboard_id}`);
                    //emit sync events
                    this.eventEmitter.emit(
                        'sync.dashboard',
                        dashboard_id
                    );
                    resp = 'sync.dashboard';
                    break;
                case ExternalEventTopic.DatasetChanged:
                    let datasetId = Number(param.data.toString());
                    this.logger.debug(`emit syncDataset events:${datasetId}`);
                    //emit sync events
                    this.eventEmitter.emit(
                        'sync.dataset',
                        datasetId
                    );
                    resp = 'sync.dataset';
                    break;
                default:
                    break;
            }
        }
        return resp;
    }
    @OnEvent('sync.dashboard', { async: true })
    async syncDashboard(dashboard_id: number) {
        this.logger.debug(`process event[syncDashboard]:${dashboard_id}`);
        await this.job_SyncDashboardFromMB.syncDashboardFromMB(dashboard_id);
        await this.job_SyncDatasetFromMB.syncDashboardCountByDashboardId(dashboard_id);
    }
    @OnEvent('sync.dataset', { async: true })
    async syncDataset(datasetId: number) {
        this.logger.debug(`process event[syncDashboard]:${datasetId}`);
        await this.job_SyncDatasetFromMB.syncDatasetFromMB(datasetId);
    }


    fireEvent(payload: DashboardEventPayload | AccountEventPayload | DatasetEventPayload) {
        this.logger.debug(`fireEvent:${JSON.stringify(payload)}`);
        //emit events
        this.eventEmitter.emit(
            payload.topic.toString(),
            payload
        );
    }

    // @OnEvent('**', { async: true })
    // handleAllEvents(payload: OperationEventPayload) {
    //     // handle and process an event
    //     this.logger.debug(`handleAllEvents:${JSON.stringify(payload)}`);
    // }

    @OnEvent('dashboard.*', { async: true })
    async handleDashboardEvents(payload: DashboardEventPayload) {
        // handle and process an event
        this.logger.debug(`handleDashboardEvents:${JSON.stringify(payload)}`);
        switch (payload.topic) {
            case DashboardEventTopic.logViewDashboard:

                let viewCount = await this.dviewlRepo.count({
                    where: { dashboardId: payload.data.dashboardId }
                });
                await this.dextRepo.update(payload.data.dashboardId, { viewCount: viewCount });

                break;
            case DashboardEventTopic.logShareDashboard:
                let shareCount = await this.dsharelRepo.count({
                    where: { dashboardId: payload.data.dashboardId }
                });
                await this.dextRepo.update(payload.data.dashboardId, { shareCount: shareCount });

                break;
            case DashboardEventTopic.logForkDashboard:
                let forkCount = await this.dforklRepo.count({
                    where: { originalDashboardId: payload.data.dashboardId }
                });
                await this.dextRepo.update(payload.data.dashboardId, { forkCount: forkCount });

                break;
            case DashboardEventTopic.logFavoriteDashboard:
                let favCount = await this.dfavlRepo.count({
                    where: { dashboardId: payload.data.dashboardId }
                });
                await this.dextRepo.update(payload.data.dashboardId, { favoriteCount: favCount });

                break;
            default:
                break;
        }
    }

    @OnEvent('account.*', { async: true })
    async handleAccountEvents(payload: AccountEventPayload) {
        // handle and process an event
        this.logger.debug(`handleDashboardEvents:${JSON.stringify(payload)}`);
        switch (payload.topic) {
            case AccountEventTopic.followAccount:
            case AccountEventTopic.unfollowAccount:

                let followingCount = await this.afRepo.count({
                    where: { accountId: payload.data.accountId }
                });
                await this.aRepo.update(payload.data.accountId, { followingAccountCount: followingCount });


                let followedCount = await this.afRepo.count({
                    where: { followedAccountId: payload.data.targetAccountId }
                });
                await this.aRepo.update(payload.data.targetAccountId, { followedAccountCount: followedCount });
                break;

            default:
                break;
        }
    }

    @OnEvent('dataset.*', { async: true })
    async handleDataSetEvents(payload: DatasetEventPayload) {
        // handle and process an event
        this.logger.debug(`handleDatasetEvents:${JSON.stringify(payload)}`);
        switch (payload.topic) {
            case DatasetEventTopic.logViewDataset:

                let viewCount = await this.datasetViewlRepo.count({
                    where: { datasetId : payload.data.dataSetId }
                });
                await this.datasetExtRepo.update(payload.data.dataSetId, { viewCount: viewCount });

                break;
            case DatasetEventTopic.logShareDataset:
                let shareCount = await this.dsharelRepo.count({
                    where: { dashboardId: payload.data.dataSetId }
                });
                await this.datasetExtRepo.update(payload.data.dataSetId, { shareCount: shareCount });

                break;

            case DatasetEventTopic.logFavoriteDataset:
                let favCount = await this.dfavlRepo.count({
                    where: { dashboardId: payload.data.dataSetId }
                });
                await this.datasetExtRepo.update(payload.data.dataSetId, { favoriteCount: favCount });

                break;
            default:
                break;
        }
    }

}