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
import { DashboardExt } from 'src/base/entity/platform-dashboard/DashboardExt';
import e from 'express';
@Injectable()
export class ShareService {
    logger: W3Logger;
    constructor(
        private readonly eventService: EventService,

        @Inject(RepositoryConsts.REPOSITORYS_PLATFORM.PLATFORM_DASHBOARD_EXT_REPOSITORY.provide)
        private dextRepo: Repository<DashboardExt>,

        @Inject(RepositoryConsts.REPOSITORYS_PLATFORM.PLATFORM_DASHBOARD_SHARE_LOG_REPOSITORY.provide)
        private dsharelRepo: Repository<DashboardShareLog>,

        @Inject(RepositoryConsts.REPOSITORYS_PLATFORM.PLATFORM_SHARE_REFERRAL_CODE_REPOSITORY.provide)
        private srcRepo: Repository<ShareReferralCode>,
    ) {
        this.logger = new W3Logger(`ShareService`);
    }
    async generateDashboardShareLink(param: GenerateShareLink4DashboardRequest, accountId?: string): Promise<GenerateShareLink4DashboardResponse> {

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
        resp.shareLink = referralCodeResult.shareLink;
        this.logger.debug(`generateDashboardShareLink: ${JSON.stringify(resp)}`);

        return resp;
    }

    async buildLink(shareItemType: ShareItemType, shareItemId: string, shareChannel: string, accountId?: string): Promise<ShareReferralCode> {
        let findExising: ShareReferralCode = null;
        if (accountId) {
            findExising = await this.srcRepo.findOne({
                where: {
                    shareChannel: shareChannel,
                    accountId: accountId,
                    category: shareItemType.toString().toLowerCase(),
                    referItemID: shareItemId,
                }
            });
        } else {
            findExising = null;
        }

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
                shareLink: ''
            };
            let publicShare = await this.buildSharePublicLink(findExising);
            findExising.publicUUID = publicShare.publicUUID;
            findExising.shareLink = publicShare.shareLink;
            await this.srcRepo.save(findExising);
            return findExising;
        }
    }

    async buildSharePublicLink(param: ShareReferralCode): Promise<any> {
        let publicLink = '';
        let publicUUID = '';

        let dashboard_id = Number(param.referItemID.trim());
        let findDashboard = await this.dextRepo.findOne({
            where: {
                id: dashboard_id
            }
        });
        if (findDashboard) {
            publicLink = findDashboard.publicLink;
            publicUUID = findDashboard.publicUUID;
        }
        if (!publicLink) {
            throw new Error(`cannot find valid publicLink for dashboard ${dashboard_id}`);
        }

        //eg: https://dev-v2.web3go.xyz/public/dashboard/dfc5d3a9-1d64-422b-b26f-0367e0fb1170？shareChannel=xxxx&referralCode=xxxxx
        //  <publicLink>shareChannel=xxxx&referralCode=xxxxx
        let shareLink = `${publicLink}?shareChannel=${param.shareChannel}&referralCode=${param.referralCode}`;

        return {
            shareLink: shareLink,
            publicUUID: publicUUID,
            publicLink: publicLink
        };
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
