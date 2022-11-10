import { Inject, Injectable } from '@nestjs/common';
import { DashboardForkLog } from 'src/base/entity/platform-dashboard/DashboardForkLog';
import { W3Logger } from 'src/base/log/logger.service';
import { RepositoryConsts } from 'src/base/orm/repositoryConsts';

import { Repository } from 'typeorm';
import { Log4ForkDashboardRequest } from './model/Log4ForkDashboardRequest';
import { Log4ForkDashboardResponse } from './model/Log4ForkDashboardResponse';
import { EventService } from 'src/event-bus/event.service';
import { DashboardEventTopic } from 'src/event-bus/model/dashboard/DashboardEventTopic';
@Injectable()
export class ForkService {
    logger: W3Logger;
    constructor(
        private readonly eventService: EventService,

        @Inject(RepositoryConsts.REPOSITORYS_PLATFORM.PLATFORM_DASHBOARD_FORK_LOG_REPOSITORY.provide)
        private dforklRepo: Repository<DashboardForkLog>,

    ) {
        this.logger = new W3Logger(`ForkService`);
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

        this.eventService.fireEvent({
            topic: DashboardEventTopic.logForkDashboard,
            data: {
                dashboardId: param.originalDashboardId
            }
        });

        return resp;
    }


}
