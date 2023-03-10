import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { ca } from 'date-fns/locale';
import { CoreUser } from 'src/base/entity/metabase/CoreUser';
import { ReportCard } from 'src/base/entity/metabase/ReportCard';
import { ReportDashboard } from 'src/base/entity/metabase/ReportDashboard';
import { ReportDashboardcard } from 'src/base/entity/metabase/ReportDashboardcard';
import { W3Logger } from 'src/base/log/logger.service';
import { RepositoryConsts } from 'src/base/orm/repositoryConsts';
import { AppConfig } from 'src/base/setting/appConfig';
import { ForkDashboardRequest } from 'src/interaction/dashboard/fork/model/ForkDashboardRequest';
import { ForkDashboardResponse } from 'src/interaction/dashboard/fork/model/ForkDashboardResponse';
import { ForkQuestionRequest } from 'src/interaction/dashboard/fork/model/ForkQuestionRequest';
import { ForkQuestionResponse } from 'src/interaction/dashboard/fork/model/ForkQuestionResponse';
import { FindManyOptions, FindOptionsWhere, In, LessThan, Like, MoreThan, Repository, SelectQueryBuilder } from 'typeorm';
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

    async findCreatorAccountIdByUserId(userId: number): Promise<string> {
        let creatorAccountId = '';
        let query = `
                            SELECT
                                u.login_attributes :: json ->> 'id' AS "creatorAccountId" 
                            FROM
                                core_user u
                            WHERE u."id"=${userId}`;

        let findCreatorResult = await this.mb_rdRepo.query(query);
        if (findCreatorResult && findCreatorResult.length > 0) {
            creatorAccountId = findCreatorResult[0].creatorAccountId
        }
        return creatorAccountId;
    }

    generateRandomEntityId() {
        return ('eid-' + (new Date()).getTime() + '-' + uuidv4().toString().replace(/-/g, '') + '').substring(0, 20);
    }
    generateRandomPublicId() {
        return (uuidv4().toString());
    }
    async copyQuestion(param: ForkQuestionRequest, targetCollectionId: number, accountId: string, enablePublic: boolean): Promise<ForkQuestionResponse> {
        let originalQuestionId = param.originalQuestionId;
        let targetDashboardId = param.targetDashboardId;

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
        let time = new Date();
        await this.mb_rcRepo.manager.transaction(async transactionalEntityManager => {

            let newCard: ReportCard = new ReportCard();
            Object.assign(newCard, {
                ...originalCard,
                id: 0,
                entityId: this.generateRandomEntityId(),
                createdAt: time,
                updatedAt: time,
                creatorId: account.id,
                collectionId: targetCollectionId,
            });
            if (enablePublic === true) {
                newCard.made_public_by_id = account.id;
                newCard.publicUuid = this.generateRandomPublicId();
            } else {
                newCard.made_public_by_id = null;
                newCard.publicUuid = null;
            }


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


    async copyDashboard(param: ForkDashboardRequest, targetCollectionId: number, accountId: string, enablePublic: boolean): Promise<ForkDashboardResponse> {
        let resp: ForkDashboardResponse = { newDashboardId: null, newCardIds: [], msg: null };

        let originalDashboardId = param.originalDashboardId;
        let originalDashboard = await this.mb_rdRepo.findOne({
            where: {
                id: originalDashboardId
            }
        });
        if (!originalDashboard) {
            resp.msg = `not find original dashboard for id=${originalDashboardId}`;
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

        let originalAllDashboardCards = await this.mb_rdcRepo.find({
            where: {
                dashboardId: originalDashboardId
            }
        });
        let originalRealCards: ReportCard[] = [];
        let originalVirtualCards: ReportDashboardcard[] = [];
        if (originalAllDashboardCards) {
            let realCardIds = originalAllDashboardCards.filter(t => t.cardId != null).map(t => t.cardId);
            originalVirtualCards = originalAllDashboardCards.filter(t => t.cardId == null).map(t => t);

            originalRealCards = await this.mb_rcRepo.find({
                where: {
                    id: In(realCardIds)
                }
            });
        }


        this.logger.log(`copyDashboard ` + JSON.stringify({
            "originalDashboardId": originalDashboardId,
            "accountId": accountId,
            "originalAllDashboardCards": originalAllDashboardCards.length,
            "originalRealCards": originalRealCards.length,
            "originalVirtualCards": originalVirtualCards.length
        }));


        let time = new Date();
        await this.mb_rdRepo.manager.transaction(async transactionalEntityManager => {

            let newDashboard: ReportDashboard = new ReportDashboard();
            Object.assign(newDashboard, {
                ...originalDashboard,
                id: 0,
                entityId: this.generateRandomEntityId(),
                createdAt: time,
                updatedAt: time,
                creatorId: account.id,
                collectionId: targetCollectionId,
                name: param.new_dashboard_name,
                description: param.description,
            });
            if (enablePublic === true) {
                newDashboard.made_public_by_id = account.id;
                newDashboard.publicUuid = this.generateRandomPublicId();
            } else {
                newDashboard.made_public_by_id = null;
                newDashboard.publicUuid = null;
            }

            this.logger.warn(newDashboard);
            await transactionalEntityManager.save<ReportDashboard>(newDashboard);
            resp.newDashboardId = newDashboard.id;

            if (originalRealCards && originalRealCards.length > 0) {
                for (const oc of originalRealCards) {

                    let newCard: ReportCard = new ReportCard();
                    Object.assign(newCard, {
                        ...oc,
                        id: 0,
                        entityId: this.generateRandomEntityId(),
                        publicUuid: this.generateRandomPublicId(),
                        createdAt: time,
                        updatedAt: time,
                        creatorId: account.id,
                        collectionId: targetCollectionId
                    });
                    if (enablePublic === true) {
                        newCard.made_public_by_id = account.id;
                        newCard.publicUuid = this.generateRandomPublicId();
                    } else {
                        newCard.made_public_by_id = null;
                        newCard.publicUuid = null;
                    }

                    //this.logger.warn(newCard);
                    await transactionalEntityManager.save<ReportCard>(newCard);
                    let newCardId = newCard.id;
                    resp.newCardIds.push(newCardId);

                    let findOriginalDashboardCard = originalAllDashboardCards.find(t => t.cardId == oc.id);
                    if (findOriginalDashboardCard) {
                        let newReportDashboardCard: ReportDashboardcard = new ReportDashboardcard();
                        Object.assign(newReportDashboardCard, {
                            ...findOriginalDashboardCard,
                            id: 0,
                            createdAt: time,
                            updatedAt: time,
                            cardId: newCardId,
                            dashboardId: resp.newDashboardId,
                            entityId: this.generateRandomEntityId(),
                        });
                        await transactionalEntityManager.save<ReportDashboardcard>(newReportDashboardCard);
                    }
                }
            }

            if (originalVirtualCards && originalVirtualCards.length > 0) {
                for (const oc of originalVirtualCards) {

                    let newReportDashboardCard: ReportDashboardcard = new ReportDashboardcard();
                    Object.assign(newReportDashboardCard, {
                        ...oc,
                        id: 0,
                        createdAt: time,
                        updatedAt: time,
                        cardId: null,
                        dashboardId: resp.newDashboardId,
                        entityId: this.generateRandomEntityId(),
                    });
                    await transactionalEntityManager.save<ReportDashboardcard>(newReportDashboardCard);

                }
            }

            resp.msg = 'success';
            this.logger.log(`copyDashboard success:` + JSON.stringify({
                "newQuestionId": resp.newDashboardId,
                "originalDashboardId": originalDashboardId,
                "accountId": accountId,
                "originalAllDashboardCards": originalAllDashboardCards.length,
                "originalRealCards": originalRealCards.length,
                "originalVirtualCards": originalVirtualCards.length
            }));
        });

        return resp;
    }



    async findDatasets(ids: number[], archived: boolean, updateInMins: number): Promise<ReportCard[]> {

        let res = [];
        const dateBeforeMinutes = new Date(new Date().getTime() - updateInMins * 60 * 1000);

        const where: FindOptionsWhere<ReportCard> = {
            dataset: true
        };

        if (updateInMins) {
            where.updatedAt = MoreThan(dateBeforeMinutes);
        }
        if (ids && ids.length) {
            where.id = In(ids);
        }
        if (typeof archived === 'boolean') {
            where.archived = archived;
        }
        res = await this.mb_rcRepo.find({
            where
        });
        return res;
    }

    // by given dashboard_id, to find all datasets in the related dashboard 
    // and to count all linked_dashboard for those datasets
    async countLinkedDashboardOfDatasetByDashboardId(dashboardId: number): Promise<{[key: number]:number}> {
        let cards = await this.mb_rdcRepo.createQueryBuilder().addSelect("card_id", "cardId").where({
            dashboardId
        }).getRawMany();
        const result = {};
        for (const card of cards) {
            result[card.cardId] = await this.countLinkedDashboardOfDataset(card.cardId);
        }
        return result;
    }

    async countLinkedDashboardOfDataset(datasetId: number): Promise<number> {
        // select distinct dashboard_id from report_dashboardcard where card_id = 462
        // TODO exclude the archive=false
        let count = await this.mb_rdcRepo.createQueryBuilder().select('DISTINCT card_id ').where({
            cardId: datasetId,
        }).getCount();
        return count;
    }

    async findLinkedDashboardIdOfDataSet(datasetId: number, startPage: number, pageSize: number): Promise<number[]> {
        // select distinct dashboard_id from report_dashboardcard where card_id = 462
        const sqlBuilder = this.mb_rdcRepo.createQueryBuilder('n').select('DISTINCT dashboard_id as dashboard_id').where(
            {
            cardId: datasetId
        }); //.addSelect("dashboard_id", "dashboardId");

        if (startPage) {
            sqlBuilder.skip(startPage);
        }
        if (pageSize) {
            sqlBuilder.take(pageSize);
        }
        const rawResult = await sqlBuilder.getRawMany();
        return rawResult.map(it => it.dashboard_id);
    }

    async copyDataset(id: number, loginUserEmail: string) {
        let account = await this.mb_cuRepo.findOne({
            where: {
                email: loginUserEmail
            }
        });
        const target = await this.mb_rcRepo.findOne({where: {id}})
        if (!target || target.archived) {
            throw new BadRequestException('the dataset is not available');
        }
        const now = new Date();
        const newOne: ReportCard = {
            ...target,
            creatorId: account.id,
            entityId: this.generateRandomEntityId(),
            createdAt: now,
            updatedAt: now,
        }

        delete newOne.id;
        delete newOne.publicUuid;

        const saveStatus = await this.mb_rcRepo.insert(newOne);
        return saveStatus.identifiers && saveStatus.identifiers[0].id;
    }
    
    // async findAllDatasets(excludeArchived: boolean): Promise<ReportDashboard[]> {
    //     return await this.mb_rdRepo.find({
    //         where: {
    //             archived: !excludeArchived
    //         }
    //     });
    // }
}
