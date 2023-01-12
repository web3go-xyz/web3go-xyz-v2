import { Inject, Injectable } from '@nestjs/common';
import { DashboardExt } from 'src/base/entity/platform-dashboard/DashboardExt';
import { DashboardFavoriteLog } from 'src/base/entity/platform-dashboard/DashboardFavoriteLog';
import { W3Logger } from 'src/base/log/logger.service';
import { RepositoryConsts } from 'src/base/orm/repositoryConsts';
import { QueryFavoriteDashboardListRequest } from 'src/dashboard/model/QueryFavoriteDashboardListRequest';
import { QueryFavoriteDashboardListResponse } from 'src/dashboard/model/QueryFavoriteDashboardListResponse';
import { EventService } from 'src/event-bus/event.service';
import { DashboardEventTopic } from 'src/event-bus/model/dashboard/DashboardEventTopic';
import { PageRequest } from 'src/viewModel/base/pageRequest';

import { Repository } from 'typeorm';
import { Log4FavoriteDashboardRequest } from './model/Log4FavoriteDashboardRequest';
import { Log4FavoriteDashboardResponse } from './model/Log4FavoriteDashboardResponse';
@Injectable()
export class FavoriteService {
    logger: W3Logger;
    constructor(
        private readonly eventService: EventService,
        @Inject(RepositoryConsts.REPOSITORYS_PLATFORM.PLATFORM_DASHBOARD_FAVORITE_LOG_REPOSITORY.provide)
        private dfavlRepo: Repository<DashboardFavoriteLog>,


    ) {
        this.logger = new W3Logger(`FavoriteService`);
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

        this.eventService.fireEvent({
            topic: DashboardEventTopic.logFavoriteDashboard,
            data: {
                accountId: request.accountId,
                dashboardId: request.dashboardId
            }
        });

        return resp;
    }
    async listFavorites(param: QueryFavoriteDashboardListRequest): Promise<QueryFavoriteDashboardListResponse> {

        let resp: QueryFavoriteDashboardListResponse = {
            totalCount: 0,
            list: []
        }
        let builder = this.dfavlRepo.createQueryBuilder("f")
            .where("1=1");
        if (param.searchName) {
            builder =
                builder.innerJoinAndSelect(DashboardExt, "d", "f.dashboard_id = d.id")
                    .andWhere("d.name like :searchName", { searchName: '%' + param.searchName + '%' });
        }
        builder =
            builder.andWhere("f.account_id=:account_id", { account_id: param.accountId })
                .offset(PageRequest.getSkip(param))
                .limit(PageRequest.getTake(param));
        builder = builder.select("f.*");

        resp.totalCount = await builder.getCount();
        let rawList = await builder.getRawMany();
        if (rawList) {
            rawList.forEach(t => {
                let item: DashboardFavoriteLog = {
                    id: t.id,
                    dashboardId: t.dashboard_id,
                    accountId: t.account_id,
                    createdAt: t.created_at
                };
                resp.list.push(item)
            });
        }

        // this.logger.debug(`listFavorites:${JSON.stringify(resp)}`);
        return resp;

    }



}
