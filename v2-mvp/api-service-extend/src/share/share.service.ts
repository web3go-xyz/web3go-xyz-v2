import { Inject, Injectable } from '@nestjs/common';
import { DashboardShareLog } from 'src/base/entity/platform-dashboard/DashboardShareLog';
import { ShareReferralCode } from 'src/base/entity/platform-dashboard/ShareReferralCode';
import { W3Logger } from 'src/base/log/logger.service';
import { RepositoryConsts } from 'src/base/orm/repositoryConsts';
import { AppConfig } from 'src/base/setting/appConfig';
import { GenerateShareLink4DashboardRequest } from 'src/share/model/GenerateShareLink4DashboardRequest';
import { GenerateShareLink4DashboardResponse } from 'src/share/model/GenerateShareLink4DashboardResponse';
import { Log4ShareDashboardRequest } from 'src/share/model/Log4ShareDashboardRequest';
import { Log4ShareDashboardResponse } from 'src/share/model/Log4ShareDashboardResponse';
import { Repository } from 'typeorm';
import { ShareItemType } from './model/ShareItemType';
import { v4 as uuidv4 } from 'uuid';
@Injectable()
export class ShareService {
    logger: W3Logger;
    constructor(
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
        let referralCodeResult: ShareReferralCode = await this.generateShareReferralCode(ShareItemType.Dashboard, param.dashboardId.toString(), param.shareChannel, accountId);

        let shareLink: string = await this.generateLink(referralCodeResult);

        resp.referralCode = referralCodeResult.referralCode;
        resp.shareLink = shareLink;
        this.logger.debug(`generateDashboardShareLink: ${JSON.stringify(resp)}`);

        return resp;
    }
    async generateLink(param: ShareReferralCode): Promise<string> {
        let link = `${AppConfig.BASE_WEB_URL}/share/${param.itemType.toLowerCase()}/${param.itemId}?shareChannel=${param.shareChannel}&referralCode=${param.referralCode}`;

        return link;
    }
    async generateShareReferralCode(shareItemType: ShareItemType, shareItemId: string, shareChannel: string, accountId: string): Promise<ShareReferralCode> {

        let findExising = await this.srcRepo.findOne({
            where: {
                shareChannel: shareChannel,
                accountId: accountId,
                itemId: shareItemId,
                itemType: shareItemType.toString().toLowerCase()
            }
        });
        if (findExising) {
            return findExising;
        }
        else {
            findExising = {
                id: 0,
                referralCode: uuidv4().toString().replace(/-/g, ''),
                itemType: shareItemType.toString().toLowerCase(),
                itemId: shareItemId,
                accountId,
                shareChannel,
                createdAt: new Date()
            };
            await this.srcRepo.save(findExising);
            return findExising;
        }
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
        }


        return resp;
    }
}
