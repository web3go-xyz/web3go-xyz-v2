import { Inject, Injectable } from '@nestjs/common';
import { DatasetShareLog } from 'src/base/entity/platform-dataset/DatasetShareLog';
import { W3Logger } from 'src/base/log/logger.service';
import { RepositoryConsts } from 'src/base/orm/repositoryConsts';

import { Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { GenerateShareLink4DatasetRequest } from './model/GenerateShareLink4DatasetRequest';
import { GenerateShareLink4DatasetResponse } from './model/GenerateShareLink4DatasetResponse';
import { Log4ShareDatasetRequest } from './model/Log4ShareDatasetRequest';
import { Log4ShareDatasetResponse } from './model/Log4ShareDatasetResponse';
import { EventService } from 'src/event-bus/event.service';
import { DatasetEventTopic } from 'src/event-bus/model/dataset/DatasetEventTopic';
import { DatasetExt } from 'src/base/entity/platform-dataset/DatasetExt';
import { ShareReferralCode } from 'src/base/entity/platform-dashboard/ShareReferralCode';

@Injectable()
export class ShareService {
    
    logger: W3Logger;
    constructor(
        private readonly eventService: EventService,

        @Inject(RepositoryConsts.REPOSITORYS_PLATFORM.PLATFORM_DASHBOARD_EXT_REPOSITORY.provide)
        private dextRepo: Repository<DatasetExt>,

        @Inject(RepositoryConsts.REPOSITORYS_PLATFORM.PLATFORM_DASHBOARD_SHARE_LOG_REPOSITORY.provide)
        private dsharelRepo: Repository<DatasetShareLog>,

        @Inject(RepositoryConsts.REPOSITORYS_PLATFORM.PLATFORM_SHARE_REFERRAL_CODE_REPOSITORY.provide)
        private srcRepo: Repository<ShareReferralCode>,
    ) {
        this.logger = new W3Logger(`ShareService`);
    }

    private SHARE_TYPE = "Dataset";

    async generateDatasetShareLink(param: GenerateShareLink4DatasetRequest, accountId?: string): Promise<GenerateShareLink4DatasetResponse> {

        this.logger.debug(`generateDatasetShareLink: ${JSON.stringify(param)}, accountId:${accountId}`);
        let resp: GenerateShareLink4DatasetResponse = {
            datasetId: param.datasetId,
            shareChannel: param.shareChannel,
            referralCode: '',
            shareLink: '',
            accountId: accountId
        };
        let referralCodeResult: ShareReferralCode = await this.buildLink(this.SHARE_TYPE, param.datasetId.toString(), param.shareChannel, accountId);
        resp.referralCode = referralCodeResult.referralCode;
        resp.shareLink = referralCodeResult.shareLink;
        this.logger.debug(`generateDatasetShareLink: ${JSON.stringify(resp)}`);

        return resp;
    }

    async buildLink(shareItemType: string, shareItemId: string, shareChannel: string, accountId?: string): Promise<ShareReferralCode> {
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

        let dataset_id = Number(param.referItemID.trim());
        let findDataset = await this.dextRepo.findOne({
            where: {
                id: dataset_id
            }
        });
        if (findDataset) {
            publicLink = findDataset.publicLink;
            publicUUID = findDataset.publicUUID;
        }
        if (!publicLink) {
            throw new Error(`cannot find valid publicLink for dataset ${dataset_id}`);
        }

        //eg: https://dev-v2.web3go.xyz/public/dataset/dfc5d3a9-1d64-422b-b26f-0367e0fb1170？shareChannel=xxxx&referralCode=xxxxx
        //  <publicLink>shareChannel=xxxx&referralCode=xxxxx
        let shareLink = `${publicLink}?shareChannel=${param.shareChannel}&referralCode=${param.referralCode}`;

        return {
            shareLink: shareLink,
            publicUUID: publicUUID,
            publicLink: publicLink
        };
    }

    async logShare(param: Log4ShareDatasetRequest, accountId: string): Promise<Log4ShareDatasetResponse> {
        let resp: Log4ShareDatasetResponse = {
            id: 0, msg: ''
        };
        let findExist = await this.dsharelRepo.findOne({
            where: {
                datasetId: param.datasetId,
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
            let newRecord: DatasetShareLog = {
                id: 0,
                datasetId: param.datasetId,
                accountId: accountId,
                createdAt: new Date(),
                shareChannel: param.shareChannel,
                referralCode: param.referralCode
            };
            await this.dsharelRepo.save(newRecord);
            resp.id = newRecord.id;
            resp.msg = "new";

            this.eventService.fireEvent({
                topic: DatasetEventTopic.logShareDataset,
                data: {
                    dataSetId: param.datasetId
                }
            });
        }


        return resp;
    }


}
