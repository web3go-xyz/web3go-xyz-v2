import { Inject, Injectable } from '@nestjs/common';
import { ca } from 'date-fns/locale';
import { CoreUser } from 'src/base/entity/metabase/CoreUser';
import { ReportCard } from 'src/base/entity/metabase/ReportCard';
import { ReportDashboard } from 'src/base/entity/metabase/ReportDashboard';
import { ReportDashboardcard } from 'src/base/entity/metabase/ReportDashboardcard';
import { W3Logger } from 'src/base/log/logger.service';
import { RepositoryConsts } from 'src/base/orm/repositoryConsts';
import { AppConfig } from 'src/base/setting/appConfig';
import { ForkQuestionResponse } from 'src/interaction/fork/model/ForkQuestionResponse';
import { In, Like, Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
@Injectable()
export class MBConnectService {


    logger: W3Logger;
    CARD_DEFAULT: any = {
        CARD_DEFAULT_SIZE_X: 4,
        CARD_DEFAULT_SIZE_Y: 4,
        CARD_DEFAULT_Locatin_ROW: 0,
        CARD_DEFAULT_Locatin_COL: 0,
        PARAMETER_MAPPINGS: '[]',
        VISUALIZATION_SETTINGS: '{}'
    }


    constructor(
        @Inject(RepositoryConsts.REPOSITORYS_METABASE.MB_REPORT_DASHBOARD_REPOSITORY.provide)
        private mb_rdRepo: Repository<ReportDashboard>,

        @Inject(RepositoryConsts.REPOSITORYS_METABASE.MB_REPORT_CARD_REPOSITORY.provide)
        private mb_rcRepo: Repository<ReportCard>,

        @Inject(RepositoryConsts.REPOSITORYS_METABASE.MB_REPORT_DASHBOARD_CARD_REPOSITORY.provide)
        private mb_rdcRepo: Repository<ReportDashboardcard>,

        @Inject(RepositoryConsts.REPOSITORYS_METABASE.MB_CORE_USER_REPOSITORY.provide)
        private mb_cuRepo: Repository<CoreUser>,
    ) {
        this.logger = new W3Logger(`MBConnectService`);
    }

    async findDashboards(dashboard_ids: number[], excludeArchived: boolean): Promise<ReportDashboard[]> {
        if (dashboard_ids && dashboard_ids.length > 0) {
            return await this.mb_rdRepo.find({
                where: {
                    id: In(dashboard_ids),
                    archived: !excludeArchived
                }
            });
        } else {
            return [];
        }
    }
    async findAllDashboards(excludeArchived: boolean): Promise<ReportDashboard[]> {
        return await this.mb_rdRepo.find({
            where: {
                archived: !excludeArchived
            }
        });
    }

    async findDashboardCreator(dashboard_id: number): Promise<string> {
        let creatorAccountId = '';
        let query = `
                            SELECT
                                d."id", 
                                d.creator_id,
                                u.login_attributes :: json ->> 'id' AS "creatorAccountId" 
                            FROM
                                report_dashboard d
                                LEFT JOIN core_user u ON d.creator_id = u."id"
                            WHERE d."id"=${dashboard_id}`;

        let findCreatorResult = await this.mb_rdRepo.query(query);
        if (findCreatorResult && findCreatorResult.length > 0) {
            creatorAccountId = findCreatorResult[0].creatorAccountId
        }
        return creatorAccountId;
    }

    generateRandomEntityId() {
        return ((new Date()).getTime() + uuidv4().toString().replace(/-/g, '') + '').substring(0, 20);
    }
    async copyQuestion(originalQuestionId: number, targetDashboardId: number, accountId: string): Promise<ForkQuestionResponse> {
        let resp: ForkQuestionResponse = { newQuestionId: null, msg: null };
        let originalCard = await this.mb_rcRepo.findOne({
            where: {
                id: originalQuestionId
            }
        });
        if (!originalCard) {
            resp.msg = `not find original card for id=${originalQuestionId}`;
            return resp;
        }

        let targetDashboard = await this.mb_rdRepo.findOne({
            where: {
                id: targetDashboardId
            }
        });
        if (!targetDashboard) {
            resp.msg = `not find target dashboard for id=${targetDashboardId}`;
            return resp;
        }

        let account = await this.mb_cuRepo.findOne({
            where: {
                loginAttributes: Like(`{"id":"${accountId}"%`)
            }
        });
        if (!account) {
            resp.msg = `not find related account for accountId=${accountId}`;
            return resp;
        }
        this.logger.log(`copyQuestion  originalQuestionId=${originalQuestionId}, targetDashboardId=${targetDashboardId}, accountId=${accountId}`);
        //update
        // --entity_id
        // --created_at
        // --updated_at
        // --creator_id
        let time = new Date();
        await this.mb_rcRepo.manager.transaction(async transactionalEntityManager => {

            let newCard: ReportCard = new ReportCard();
            Object.assign(newCard, {
                ...originalCard,
                id: 0,
                entityId: this.generateRandomEntityId(),
                publicUuid: this.generateRandomEntityId(),
                createdAt: time,
                updatedAt: time,
                creatorId: account.id,
                collectionId: AppConfig.DASHBOARD_PUBLIC_COLLECTION_ID
            });


            //this.logger.warn(newCard);
            await transactionalEntityManager.save<ReportCard>(newCard);
            let newCardId = newCard.id;

            let newReportDashboardCard: ReportDashboardcard = new ReportDashboardcard();
            Object.assign(newReportDashboardCard, {
                id: 0,
                createdAt: time,
                updatedAt: time,
                sizeX: this.CARD_DEFAULT.CARD_DEFAULT_SIZE_X,
                sizeY: this.CARD_DEFAULT.CARD_DEFAULT_SIZE_Y,
                row: this.CARD_DEFAULT.CARD_DEFAULT_Locatin_ROW,
                col: this.CARD_DEFAULT.CARD_DEFAULT_Locatin_COL,
                cardId: newCardId,
                dashboardId: targetDashboardId,
                parameterMappings: this.CARD_DEFAULT.PARAMETER_MAPPINGS,
                visualizationSettings: this.CARD_DEFAULT.VISUALIZATION_SETTINGS,
                entityId: this.generateRandomEntityId(),
            });
            await transactionalEntityManager.save<ReportDashboardcard>(newReportDashboardCard);

            resp.newQuestionId = newCardId;
            resp.msg = 'success';
            this.logger.log(`copyQuestion success: newQuestionId=${resp.newQuestionId}, originalQuestionId=${originalQuestionId}, targetDashboardId=${targetDashboardId}, accountId=${accountId}`); targetDashboardId
        });


        return resp;

    }

}
