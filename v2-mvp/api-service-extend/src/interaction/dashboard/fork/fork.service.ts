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
import { ForkQuestionRequest } from './model/ForkQuestionRequest';
import { ForkQuestionResponse } from './model/ForkQuestionResponse';
import { AccountBaseService } from 'src/account/base/account-base.service';
import { MBConnectService } from 'src/mb-connect/mb-connect.service';
import { DashboardExt } from 'src/base/entity/platform-dashboard/DashboardExt';
@Injectable()
export class ForkService {


    logger: W3Logger;
    constructor(
        private readonly mbConnectService: MBConnectService,
        private readonly eventService: EventService,
        private readonly jwtService: JWTAuthService,
        @Inject(RepositoryConsts.REPOSITORYS_PLATFORM.PLATFORM_DASHBOARD_FORK_LOG_REPOSITORY.provide)
        private dforklRepo: Repository<DashboardForkLog>,
        @Inject(RepositoryConsts.REPOSITORYS_PLATFORM.PLATFORM_DASHBOARD_EXT_REPOSITORY.provide)
        private dextRepo: Repository<DashboardExt>,


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

    //
    async forkDashboard_old(request: Request, param: ForkDashboardRequest, accountId: string): Promise<ForkDashboardResponse> {
        let resp: ForkDashboardResponse = {
            newDashboardId: 0,
            newCardIds: [],
            msg: ''
        };
        const axios = require('axios').default;
        let cookie = this.jwtService.extractXCookieFromHttpRequest(request);

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
        const { data, status } = await axios.request(options);
        // console.log(`response_copy:`, data);
        if (status == 200 && data) {

            //sample response data:
            // description: '52-fork',
            // archived: false,
            // collection_position: null,
            // enable_embedding: false,
            // collection_id: 40,
            // show_in_getting_started: false,
            // name: '52-fork',
            // caveats: null,
            // creator_id: 35,
            // updated_at: '2022-11-18T06:29:46.903815Z',
            // made_public_by_id: null,
            // embedding_params: null,
            // cache_ttl: null,
            // id: 61,
            // position: null,
            // entity_id: 'jNzAfviS0iFd9cRiDCsUG',
            // parameters: [],
            // created_at: '2022-11-18T06:29:46.903815Z',
            // public_uuid: null,
            // points_of_interest: null
            resp.newDashboardId = data.id || 0;
            this.logger.log(`new fork dashboard ${resp.newDashboardId}`);
        }
        else {
            throw new Error(`copy dashboard ${param.originalDashboardId} failed`);
        }

        if (resp.newDashboardId) {
            //update dashboard as public
            let api_enable_public_link = `${AppConfig.BASE_METABASE_API_URL}/dashboard/${resp.newDashboardId}/public_link`;
            let options_public_link = {
                method: 'POST',
                url: api_enable_public_link,
                headers: {
                    Cookie: cookie
                }
            };
            const { data: data_pl, status: status_pl } = await axios.request(options_public_link);
            console.log(`response_public_link:`, data_pl);
            if (status_pl === 200 && data_pl) {
                //sample response data
                // {
                //     "uuid": "0098cb46-53b0-4fa7-b1ec-c054dc28d3c4"
                // }
                let uuid = data_pl.uuid || '';
                this.logger.log(`public uuid for dashboard ${resp.newDashboardId}: ${uuid}`);
            }
            else {
                throw new Error(`update public uuid dashboard ${resp.newDashboardId} failed`);
            }

            //sync dashboard
            await this.eventService.syncDashboard(resp.newDashboardId);
            this.logger.log(`syncDashboard ${resp.newDashboardId} finished.`);

            await this.logFork({
                originalDashboardId: param.originalDashboardId,
                forkedDashboardId: resp.newDashboardId
            }, accountId);
            this.logger.log(`logFork for dashboard ${resp.newDashboardId} finished.`)

            resp.msg = 'success';
        }
        return resp;
    }

    //duplicate dashboard + all questions
    async forkDashboard(request: Request, param: ForkDashboardRequest, accountId: string): Promise<ForkDashboardResponse> {

        let targetCollectionId = AppConfig.DASHBOARD_PUBLIC_COLLECTION_ID;

        let enablePublic = false;
        let resp: ForkDashboardResponse = await this.mbConnectService.copyDashboard(param, targetCollectionId, accountId, enablePublic);

        if (resp.newDashboardId) {

            //sync dashboard
            await this.eventService.syncDashboard(resp.newDashboardId);
            this.logger.log(`syncDashboard ${resp.newDashboardId} finished.`);
            await this.logFork({
                originalDashboardId: param.originalDashboardId,
                forkedDashboardId: resp.newDashboardId
            }, accountId);
            this.logger.log(`logFork for dashboard ${resp.newDashboardId} finished.`)

            resp.msg = 'success';
        }
        return resp;
    }

    //duplicate question
    async forkQuestion(request: Request, param: ForkQuestionRequest, accountId: string): Promise<ForkQuestionResponse> {
        let targetCollectionId = AppConfig.DASHBOARD_PUBLIC_COLLECTION_ID;

        let enablePublic = false;
        let resp: ForkQuestionResponse = await this.mbConnectService.copyQuestion(param, targetCollectionId, accountId, enablePublic);

        return resp;
    }

}
