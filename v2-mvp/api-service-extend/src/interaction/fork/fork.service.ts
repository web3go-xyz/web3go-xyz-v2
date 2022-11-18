import { Inject, Injectable } from '@nestjs/common';
import { DashboardForkLog } from 'src/base/entity/platform-dashboard/DashboardForkLog';
import { W3Logger } from 'src/base/log/logger.service';
import { RepositoryConsts } from 'src/base/orm/repositoryConsts';

import { Repository } from 'typeorm';
import { Log4ForkDashboardRequest } from './model/Log4ForkDashboardRequest';
import { Log4ForkDashboardResponse } from './model/Log4ForkDashboardResponse';
import { EventService } from 'src/event-bus/event.service';
import { DashboardEventTopic } from 'src/event-bus/model/dashboard/DashboardEventTopic';
import { ForkDashboardRequest } from './model/ForkDashboardRequest';
import { ForkDashboardResponse } from './model/ForkDashboardResponse';
import { AppConfig } from 'src/base/setting/appConfig';
import { Request } from 'express';
import { JWTAuthService } from 'src/base/auth/jwt-auth.service';
@Injectable()
export class ForkService {

    logger: W3Logger;
    constructor(
        private readonly eventService: EventService,
        private readonly jwtService: JWTAuthService,
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

    async forkDashboard(request: Request, param: ForkDashboardRequest, accountId: string): Promise<ForkDashboardResponse> {
        let forkedDashboardId = 0;
        let resp: ForkDashboardResponse = {
            forkedDashboardId: 0,
            msg: ''
        };
        const axios = require('axios').default;
        let cookie = this.jwtService.extractCookieFromHttpRequest(request);

        //call api to copy dashboard
        let public_collection_id = AppConfig.DASHBOARD_PUBLIC_COLLECTION_ID;
        let api_copy = `${AppConfig.BASE_METABASE_API_URL}/dashboard/${param.originalDashboardId}/copy`;
        let options = {
            method: 'POST',
            url: api_copy,
            headers: {
                Cookie: cookie
            },
            data: {
                collection_id: public_collection_id,
                description: param.description,
                name: param.new_dashboard_name
            }
        };
        let response_copy = await axios.request(options);
        console.log(`response_copy:`, response_copy);

        resp.forkedDashboardId = 0;

        if (resp.forkedDashboardId) {
            let api_enable_public_link = `${AppConfig.BASE_METABASE_API_URL}/dashboard/${forkedDashboardId}/public_link`;
            let options_public_link = {
                method: 'POST',
                url: api_enable_public_link,
                headers: {
                    Cookie: cookie
                }
            };
            let response_public_link = await axios.request(options_public_link);
            console.log(`response_public_link:`, response_public_link);

            let api_event = `${AppConfig.BASE_API_URL}/api/v2/event/externalEvent`;

            await this.logFork({
                originalDashboardId: param.originalDashboardId,
                forkedDashboardId: forkedDashboardId
            }, accountId);
        }
        return resp;
    }

}
