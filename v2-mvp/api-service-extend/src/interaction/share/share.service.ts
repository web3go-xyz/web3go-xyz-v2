import { Inject, Injectable } from '@nestjs/common';
import { DashboardShareLog } from 'src/base/entity/platform-dashboard/DashboardShareLog';
import { ShareReferralCode } from 'src/base/entity/platform-dashboard/ShareReferralCode';
import { W3Logger } from 'src/base/log/logger.service';
import { RepositoryConsts } from 'src/base/orm/repositoryConsts';
import { AppConfig } from 'src/base/setting/appConfig';

import { Repository } from 'typeorm';
import { ShareItemType } from './model/ShareItemType';
import { v4 as uuidv4 } from 'uuid';
import { GenerateShareLink4DashboardRequest } from './model/GenerateShareLink4DashboardRequest';
import { GenerateShareLink4DashboardResponse } from './model/GenerateShareLink4DashboardResponse';
import { Log4ShareDashboardRequest } from './model/Log4ShareDashboardRequest';
import { Log4ShareDashboardResponse } from './model/Log4ShareDashboardResponse';
import { EventService } from 'src/event-bus/event.service';
import { DashboardEventTopic } from 'src/event-bus/model/dashboard/DashboardEventTopic';
import { MBConnectService } from 'src/mb-connect/mb-connect.service';
@Injectable()
export class ShareService {
    logger: W3Logger;
    constructor(
        private readonly eventService: EventService,
        private readonly mbConnectService: MBConnectService,

        @Inject(RepositoryConsts.REPOSITORYS_PLATFORM.PLATFORM_DASHBOARD_SHARE_LOG_REPOSITORY.provide)
        private dsharelRepo: Repository<DashboardShareLog>,

        @Inject(RepositoryConsts.REPOSITORYS_PLATFORM.PLATFORM_SHARE_REFERRAL_CODE_REPOSITORY.provide)
        private srcRepo: Repository<ShareReferralCode>,
    ) {
        this.logger = new W3Logger(`ShareService`);
    }
    async generateDashboardShareLink(param: GenerateShareLink4DashboardRequest, accountId: string): Promise<GenerateShareLink4DashboardResponse> {

        this.logger.debug(`generateDashboardShareLink: ${JSON.stringify(param)}, accountId:${accountId}`);
        let resp: GenerateShareLink4DashboardResponse = {
            dashboardId: param.dashboardId,
            shareChannel: param.shareChannel,
            referralCode: '',
            shareLink: '',
            accountId: accountId
        };
        let referralCodeResult: ShareReferralCode = await this.buildLink(ShareItemType.Dashboard, param.dashboardId.toString(), param.shareChannel, accountId);
        resp.referralCode = referralCodeResult.referralCode;
        resp.shareLink = referralCodeResult.public_link;
        this.logger.debug(`generateDashboardShareLink: ${JSON.stringify(resp)}`);

        return resp;
    }

    async buildLink(shareItemType: ShareItemType, shareItemId: string, shareChannel: string, accountId: string): Promise<ShareReferralCode> {

        let findExising = await this.srcRepo.findOne({
            where: {
                shareChannel: shareChannel,
                accountId: accountId,
                category: shareItemType.toString().toLowerCase(),
                referItemID: shareItemId,
            }
        });
        if (findExising) {
            return findExising;
        }
        else {
            findExising = {
                id: 0,
                referralCode: uuidv4().toString().replace(/-/g, ''),
                category: shareItemType.toString().toLowerCase(),
                referItemID: shareItemId,
                accountId,
                shareChannel,
                createdAt: new Date(),
                publicUUID: '',
                public_link: ''
            };
            findExising.publicUUID = await this.getPublicUUID(findExising);
            findExising.public_link = await this.formatlink(findExising);
            await this.srcRepo.save(findExising);
            return findExising;
        }
    }
    async getPublicUUID(param: ShareReferralCode): Promise<string> {
        let public_uuid = '';

        let findDashboards = await this.mbConnectService.findDashboards(Number(param.referItemID.trim()));
        if (findDashboards && findDashboards.length > 0) {
            public_uuid = findDashboards[0].publicUuid;
        }
        if (!public_uuid) {
            throw new Error('cannot find valid public_uuid');
        }
        return public_uuid;
    }
    async formatlink(param: ShareReferralCode): Promise<string> {
        //eg: https://dev-v2.web3go.xyz/public/dashboard/dfc5d3a9-1d64-422b-b26f-0367e0fb1170
        let link = `${AppConfig.BASE_WEB_URL}/public/${param.category.toLowerCase()}/${param.publicUUID.toLowerCase()}?shareChannel=${param.shareChannel}&referralCode=${param.referralCode}`;

        return link;
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

            this.eventService.fireEvent({
                topic: DashboardEventTopic.logShareDashboard,
                data: {
                    dashboardId: param.dashboardId
                }
            });
        }


        return resp;
    }


}
