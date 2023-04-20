import { Inject, Injectable } from '@nestjs/common';
import { DashboardExt } from 'src/base/entity/platform-dashboard/DashboardExt';
import { DashboardFavoriteLog } from 'src/base/entity/platform-dashboard/DashboardFavoriteLog';
import { DatasetFavoriteLog } from 'src/base/entity/platform-dataset/DatasetFavoriteLog';
import { W3Logger } from 'src/base/log/logger.service';
import { RepositoryConsts } from 'src/base/orm/repositoryConsts';
import { QueryFavoriteDashboardListRequest } from 'src/dashboard/model/QueryFavoriteDashboardListRequest';
import { EventService } from 'src/event-bus/event.service';
import { DatasetEventTopic } from 'src/event-bus/model/dataset/DatasetEventTopic';
import { PageRequest } from 'src/viewModel/base/pageRequest';

import { Repository } from 'typeorm';
import { Log4FavoriteRequest } from './model/Log4FavoriteRequest';
import { Log4FavoriteResponse } from './model/Log4FavoriteResponse';
import { QueryFavoriteDatasetListResponse } from './model/QueryFavoriteDatasetListResponse';
@Injectable()
export class FavoriteService {
    logger: W3Logger;
    constructor(
        private readonly eventService: EventService,
        @Inject(RepositoryConsts.REPOSITORYS_PLATFORM.PLATFORM_DATASET_FAVORITE_LOG_REPOSITORY.provide)
        private dfavlRepo: Repository<DatasetFavoriteLog>,


    ) {
        this.logger = new W3Logger(`FavoriteService`);
    }
    async logFavorite(request: Log4FavoriteRequest): Promise<Log4FavoriteResponse> {

        let resp: Log4FavoriteResponse = {
            id: 0, msg: ''
        };
        let findRecord = await this.dfavlRepo.findOne({
            where: {
                accountId: request.accountId,
                datasetId: request.dataSetId
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
                datasetId: request.dataSetId,
                accountId: request.accountId,
                createdAt: new Date()
            };
            await this.dfavlRepo.save(findRecord);
            resp.id = findRecord.id;
            resp.msg = "new";
        }

        this.eventService.fireEvent({
            topic: DatasetEventTopic.logFavoriteDataset,
            data: {
                accountId: request.accountId,
                dataSetId: request.dataSetId
            }
        });

        return resp;
    }
    async listFavorites(param: QueryFavoriteDashboardListRequest): Promise<QueryFavoriteDatasetListResponse> {

        let resp: QueryFavoriteDatasetListResponse = {
            totalCount: 0,
            list: []
        }
        let builder = this.dfavlRepo.createQueryBuilder("f")
            .where("1=1");
        if (param.searchName) {
            builder =
                builder.innerJoinAndSelect(DashboardExt, "d", "f.dataset_id = d.id")
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
                let item: DatasetFavoriteLog = {
                    id: t.id,
                    datasetId: t.dataset_id,
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
