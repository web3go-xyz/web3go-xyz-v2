import { Inject, Injectable } from '@nestjs/common';
import { DashboardViewLog } from 'src/base/entity/platform-dashboard/DashboardViewLog';
import { DatasetViewLog } from 'src/base/entity/platform-dataset/DatasetViewLog';

import { W3Logger } from 'src/base/log/logger.service';
import { RepositoryConsts } from 'src/base/orm/repositoryConsts';
import { EventService } from 'src/event-bus/event.service';
import { DashboardEventTopic } from 'src/event-bus/model/dashboard/DashboardEventTopic';
import { DatasetEventTopic } from 'src/event-bus/model/dataset/DatasetEventTopic';
import { Repository } from 'typeorm';
import { Log4ViewDashboardRequest } from './model/Log4ViewDashboardRequest';
import { Log4ViewDashboardResponse } from './model/Log4ViewDashboardResponse';
import { Log4ViewDatasetRequest } from './model/Log4ViewDatasetRequest';
import { Log4ViewDatasetResponse } from './model/Log4ViewDatasetResponse';
@Injectable()
export class ViewService {
    logger: W3Logger;
    constructor(
        private readonly eventService: EventService,

        @Inject(RepositoryConsts.REPOSITORYS_PLATFORM.PLATFORM_DASHBOARD_VIEW_LOG_REPOSITORY.provide)
        private dviewlRepo: Repository<DashboardViewLog>,
        @Inject(RepositoryConsts.REPOSITORYS_PLATFORM.PLATFORM_DATASET_VIEW_LOG_REPOSITORY.provide)
        private dataViewRepo: Repository<DatasetViewLog>

    ) {
        this.logger = new W3Logger(`ViewService`);
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

        this.eventService.fireEvent({
            topic: DashboardEventTopic.logViewDashboard,
            data: {
                dashboardId: param.dashboardId
            },
        });

        return resp;
    }
    async logView4Dataset(param: Log4ViewDatasetRequest, accountId: string): Promise<Log4ViewDatasetResponse> {
        let resp: Log4ViewDatasetResponse = {
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
