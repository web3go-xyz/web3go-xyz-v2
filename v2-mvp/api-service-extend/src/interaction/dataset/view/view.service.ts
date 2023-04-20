import { Inject, Injectable } from '@nestjs/common';
import { DatasetViewLog } from 'src/base/entity/platform-dataset/DatasetViewLog';

import { W3Logger } from 'src/base/log/logger.service';
import { RepositoryConsts } from 'src/base/orm/repositoryConsts';
import { EventService } from 'src/event-bus/event.service';
import { DatasetEventTopic } from 'src/event-bus/model/dataset/DatasetEventTopic';
import { Repository } from 'typeorm';
import { Log4ViewRequest } from './model/Log4ViewRequest';
import { Log4ViewResponse } from './model/Log4ViewResponse';
@Injectable()
export class ViewService {
    logger: W3Logger;
    constructor(
        private readonly eventService: EventService,

        @Inject(RepositoryConsts.REPOSITORYS_PLATFORM.PLATFORM_DATASET_VIEW_LOG_REPOSITORY.provide)
        private dviewlRepo: Repository<DatasetViewLog>,
        @Inject(RepositoryConsts.REPOSITORYS_PLATFORM.PLATFORM_DATASET_VIEW_LOG_REPOSITORY.provide)
        private dataViewRepo: Repository<DatasetViewLog>

    ) {
        this.logger = new W3Logger(`ViewService`);
    }

    async logView(param: Log4ViewRequest, accountId: string): Promise<Log4ViewResponse> {
        let resp: Log4ViewResponse = {
            id: 0, msg: ''
        };
        let newRecord: DatasetViewLog = {
            id: 0,
            datasetId: param.datasetId,
            viewerAccountId: accountId,
            createdAt: new Date(),
            referralCode: param.referralCode
        };
        await this.dviewlRepo.save(newRecord);
        resp.id = newRecord.id;
        resp.msg = "new";

        this.eventService.fireEvent({
            topic: DatasetEventTopic.logViewDataset,
            data: {
                dataSetId: param.datasetId
            },
        });

        return resp;
    }
    async logView4Dataset(param: Log4ViewRequest, accountId: string): Promise<Log4ViewResponse> {
        let resp: Log4ViewResponse = {
            id: 0, msg: ''
        };
        let newRecord: DatasetViewLog = {
            id: 0,
            datasetId: param.datasetId,
            viewerAccountId: accountId,
            createdAt: new Date(),
            referralCode: param.referralCode
        };
        await this.dataViewRepo.save(newRecord);
        resp.id = newRecord.id;
        resp.msg = "new";

        this.eventService.fireEvent({
            topic: DatasetEventTopic.logViewDataset,
            data: {
                dataSetId: param.datasetId
            },
        });

        return resp;
    }
}
