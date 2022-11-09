import { Inject, Injectable } from '@nestjs/common';
import { DashboardViewLog } from 'src/base/entity/platform-dashboard/DashboardViewLog';
import { W3Logger } from 'src/base/log/logger.service';
import { RepositoryConsts } from 'src/base/orm/repositoryConsts';
import { EventService } from 'src/event-bus/event.service';
import { OperationEventTopic } from 'src/event-bus/model/OperationEventTopic';
import { Repository } from 'typeorm';
import { Log4ViewDashboardRequest } from './model/view/Log4ViewDashboardRequest';
import { Log4ViewDashboardResponse } from './model/view/Log4ViewDashboardResponse';
@Injectable()
export class ViewService {
    logger: W3Logger;
    constructor(
        private readonly eventService: EventService,

        @Inject(RepositoryConsts.REPOSITORYS_PLATFORM.PLATFORM_DASHBOARD_VIEW_LOG_REPOSITORY.provide)
        private dviewlRepo: Repository<DashboardViewLog>,
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
            topic: OperationEventTopic.logViewDashboard,
            data: {
                dashboardId: param.dashboardId
            }
        });

        return resp;
    }

}
