import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { ConfigTag } from 'src/base/entity/platform-config/ConfigTag';
import { DashboardExt } from 'src/base/entity/platform-dashboard/DashboardExt';
import { DashboardTag } from 'src/base/entity/platform-dashboard/DashboradTag';
import { W3Logger } from 'src/base/log/logger.service';
import { RepositoryConsts } from 'src/base/orm/repositoryConsts';
import { PageRequest } from 'src/viewModel/base/pageRequest';
import { DashboardSummary } from 'src/dashboard/model/DashboardSummary';
import { QueryDashboardDetailRequest } from 'src/dashboard/model/QueryDashboardDetailRequest';
import { QueryDashboardDetailResponse } from 'src/dashboard/model/QueryDashboardDetailResponse';
import { QueryDashboardListRequest } from 'src/dashboard/model/QueryDashboardListRequest';
import { QueryDashboardListResponse } from 'src/dashboard/model/QueryDashboardListResponse';
import { FindManyOptions, FindOptionsWhere, In, Like, Not, Raw, Repository } from 'typeorm';
import { QueryRelatedDashboardsRequest } from './model/QueryRelatedDashboardsRequest';
import { ReportCard } from 'src/base/entity/metabase/ReportCard';
import { Collection } from 'src/base/entity/metabase/Collection';
import { MBConnectService } from 'src/mb-connect/mb-connect.service';
import { QueryDashboardByDataset } from './model/QueryDashboardByDataset';
import { AccountFollower } from 'src/base/entity/platform-user/AccountFollower';
import { DatasetExt } from 'src/base/entity/platform-dataset/DatasetExt';
import { DashboardDatasetRelation } from 'src/base/entity/platform-dataset/DashboardDatasetRelation';

@Injectable()
export class DashboardService {

    logger: W3Logger;

    constructor(

        @Inject(RepositoryConsts.REPOSITORYS_PLATFORM.PLATFORM_CONFIG_TAG_REPOSITORY.provide)
        private ctagRepo: Repository<ConfigTag>,

        @Inject(RepositoryConsts.REPOSITORYS_PLATFORM.PLATFORM_DASHBOARD_EXT_REPOSITORY.provide)
        private dextRepo: Repository<DashboardExt>,
        @Inject(RepositoryConsts.REPOSITORYS_PLATFORM.PLATFORM_DASHBOARD_TAG_REPOSITORY.provide)
        private dtagRepo: Repository<DashboardTag>,

        @Inject(RepositoryConsts.REPOSITORYS_METABASE.MB_REPORT_CARD_REPOSITORY.provide)
        private dataSetRepo: Repository<ReportCard>,

        @Inject(RepositoryConsts.REPOSITORYS_PLATFORM.PLATFORM_DATASET_EXT_REPOSITORY.provide)
        private datasetExtRepo: Repository<DatasetExt>,

        @Inject(RepositoryConsts.REPOSITORYS_PLATFORM.PLATFORM_ACCOUNT_FOLLOWER_REPOSITORY.provide)
        private accountFollowerRepo: Repository<AccountFollower>,

        // dashboard 2 dataset relation
        @Inject(RepositoryConsts.REPOSITORYS_PLATFORM.PLATFORM_DASHBOARD_DATASET_RELATION_REPOSITORY.provide)
        private dashboard2DatasetMapRepo: Repository<DashboardDatasetRelation>,
        

        private readonly mbConnectService: MBConnectService,
    ) {
        this.logger = new W3Logger(`DashboardService`);
    }

    async getAllFollowed(accountId) {
       const data = await this.accountFollowerRepo.find({
            where: {
                followedAccountId: accountId
            },
            select: ['followedAccountId'],
        })
        return data.map(it => it.followedAccountId);
    }

    async list(request: QueryDashboardListRequest, userSession): Promise<QueryDashboardListResponse> {

        let resp: QueryDashboardListResponse = new QueryDashboardListResponse();

        let filterDashboardIds: number[] = [];
        if (request.tagIds && request.tagIds.length > 0) {

            let filter_dashboard_tags: any[];
            if (request.dashboardIds && request.dashboardIds.length > 0) {
                filter_dashboard_tags = await this.dtagRepo.createQueryBuilder('t')
                    .where("t.tag_id IN (:...tagIds)", { tagIds: request.tagIds })
                    .andWhere("t.dashboard_id IN (:...dashboardIds)", { dashboardIds: request.dashboardIds })
                    .addGroupBy("t.dashboard_id")
                    .select("dashboard_id", "dashboardId")
                    .getRawMany();
            }
            else {
                filter_dashboard_tags = await this.dtagRepo.createQueryBuilder('t')
                    .where("t.tag_id IN (:...tagIds)", { tagIds: request.tagIds })
                    .addGroupBy("t.dashboard_id")
                    .select("dashboard_id", "dashboardId")
                    .getRawMany();
            }


            // this.logger.debug(`filter_dashboard_tags:${JSON.stringify(filter_dashboard_tags)}`);
            if (filter_dashboard_tags) {
                for (const d of filter_dashboard_tags) {
                    filterDashboardIds.push(d.dashboardId);
                }
            }

            if (!filterDashboardIds || filterDashboardIds.length == 0) {
                this.logger.warn(`no dashboard for the tagIds ${JSON.stringify(request.tagIds)}`);
                return resp;
            }
        }

        if (filterDashboardIds.length == 0 && request.dashboardIds && request.dashboardIds.length > 0) {
            for (const d of request.dashboardIds) {
                if (filterDashboardIds.indexOf(d) == -1) {
                    filterDashboardIds.push(d);
                }
            }
        }

        let where: FindOptionsWhere<DashboardExt> = {};
        if (filterDashboardIds && filterDashboardIds.length > 0) {
            where.id = In(filterDashboardIds);
        }
        if (request.searchName) {
            where.name = Like(`%${request.searchName}%`);
        }
        const logginUserId = userSession && userSession.id;
        let isAllowShowingDraft = logginUserId === request.creator;
        if (request.creatorFilterBy) {
            // if notNull(request.creator) && notNull(userSession) && request.creator !== request.creator, raise the EXP
            if (request.creatorFilterBy === 'ME' && request.creator && logginUserId !== request.creator) {
                throw new BadRequestException('permission failed, creatorFilterBy is ME but creator is not consistent with the user session');
            }
            if (logginUserId && request.creatorFilterBy === 'ME') {
                request.creator = userSession.id;
            }
            if (request.creatorFilterBy === 'FOLLOWING') {
                isAllowShowingDraft = false;
                request.creator = '';
                where.creatorAccountId = In(await this.getAllFollowed(logginUserId));
            }
        }
        if (request.creator) {
            where.creatorAccountId = request.creator;
        } 
        // specified the defat status of a dashboard, 0 or default: not limited(mixed the drafted and the posted);  1: draft data only 2: only posted(no drafts)

         if (request.draftStatus === 1) { // draft data only
            if (!isAllowShowingDraft) {
                //throw new BadRequestException('permission failed')
                // to make the query dismatch any records
                where.id = -11;
            } else {
                where.publicLink = '';
            } 
        } else if (request.draftStatus === 2) {         // only posted
            where.publicLink = Not(''); //Not(Raw('NULL'));
        } else {  // mixed
            if (!isAllowShowingDraft) { // if no auth, only show posted
                where.publicLink = Not('')
            } 
        }

        
        let options: FindManyOptions<DashboardExt> = {
            where: where,
            take: PageRequest.getTake(request),
            skip: PageRequest.getSkip(request),
        };
        if (request.orderBys && request.orderBys.length > 0) {
            options.order = {};
            request.orderBys.forEach((d) => (options.order[d.sort] = d.order));
        } else {
            options.order = {
                createdAt: 'DESC',
            };
        }

        let dashboardResult = await this.dextRepo.findAndCount(options);
        resp.totalCount = dashboardResult[1];
        resp.list = [];

        let records = dashboardResult[0];
        if (!records || records.length == 0) {
            this.logger.warn(`no dashboards found`);
            return resp;
        }
        filterDashboardIds = records.map(t => t.id);
        let dashboard_tags = await this.dtagRepo.find({
            where: {
                dashboardId: In(filterDashboardIds)
            }
        });
        //this.logger.debug(`dashboard_tags:${JSON.stringify(dashboard_tags)}`);

        let filterTagIds = Array.from(new Set(dashboard_tags.map(t => t.tagId)));
        //this.logger.debug(`filterTagIds:${JSON.stringify(filterTagIds)}`);
        let tags = await this.ctagRepo.find({
            where: {
                id: In(filterTagIds)
            }
        });
        for (const record of records) {

            let d: DashboardSummary = {
                ...record,
                tagList: []
            }
            // this.logger.debug(`dashboardSummary:${JSON.stringify(d)}`);
            for (const dt of dashboard_tags) {
                if (dt.dashboardId == d.id) {
                    let findTag = tags.find(t => t.id == dt.tagId);
                    // this.logger.debug(`findTag:${JSON.stringify(findTag)}`);
                    if (findTag) {
                        d.tagList.push(findTag);
                    }
                }
            }

            resp.list.push(d);

        }

        return resp;
    }

    async detail(request: QueryDashboardDetailRequest): Promise<QueryDashboardDetailResponse> {

        let resp: QueryDashboardDetailResponse = {
            list: []
        }

        let options: FindManyOptions<DashboardExt> = {
            where: {
                id: In(request.dashboardIds)
            },
            order: {
                id: 'ASC'
            }
        };

        let records = await this.dextRepo.find(options);

        if (!records || records.length == 0) {
            this.logger.warn(`no dashboards found`);
            return resp;
        }
        let filterDashboardIds = records.map(t => t.id);
        let dashboard_tags = await this.dtagRepo.find({
            where: {
                dashboardId: In(filterDashboardIds)
            }
        });
        //this.logger.debug(`dashboard_tags:${JSON.stringify(dashboard_tags)}`);

        let filterTagIds = Array.from(new Set(dashboard_tags.map(t => t.tagId)));
        //this.logger.debug(`filterTagIds:${JSON.stringify(filterTagIds)}`);
        let tags = await this.ctagRepo.find({
            where: {
                id: In(filterTagIds)
            }
        });
        for (const record of records) {

            let d: DashboardSummary = {
                ...record,
                tagList: []
            }
            // this.logger.debug(`dashboardSummary:${JSON.stringify(d)}`);
            for (const dt of dashboard_tags) {
                if (dt.dashboardId == d.id) {
                    let findTag = tags.find(t => t.id == dt.tagId);
                    // this.logger.debug(`findTag:${JSON.stringify(findTag)}`);
                    if (findTag) {
                        d.tagList.push(findTag);
                    }
                }
            }
            resp.list.push(d);
        }

        return resp;
    }


    async refresh(param: QueryDashboardDetailRequest): Promise<any> {
        let dashboards = await this.dextRepo.find({
            where: {
                id: In(param.dashboardIds)
            },
            select: ["id"]
        });
        if (dashboards) {
            for (const d of dashboards) {
                d.latestRefreshTime = new Date();
                //TODO refresh for what??
                await this.dextRepo.update(d.id, { latestRefreshTime: d.latestRefreshTime });
            }
        }
    }


    async searchRelatedDashboards(param: QueryRelatedDashboardsRequest, userSession): Promise<QueryDashboardListResponse> {

        let resp = await this.list({
            tagIds: param.tagIds,
            searchName: '',
            creator: '',
            dashboardIds: [],
            pageSize: param.pageSize,
            pageIndex: param.pageIndex,
            orderBys: param.orderBys,
            // TODO TEST
            draftStatus: null
        }, userSession);

        return resp;
    }

    private async findDatasetSourceIdsByDatesetId(datasetId): Promise<number[]> {
        const data = await this.datasetExtRepo.createQueryBuilder().select('id').where({sourceId: datasetId}).getRawMany();
        return data.length ? data.map(it => it.id) : [];
    }

    async searchByDataset(param: QueryDashboardByDataset, userSession): Promise<QueryDashboardListResponse> {
        param.pageIndex = param.pageIndex || 1;
        param.pageSize = param.pageSize || 100;



        const dashboardIds = (await this.dashboard2DatasetMapRepo.createQueryBuilder().select('DISTINCT dashboard_id', 'dashboard_id').where(
            {  sourceReportCardId:  param.datasetId}
        ).orWhere({  reportCardId:  param.datasetId}).getRawMany()).map(it => it.dashboard_id);
                // if (!dashboardIds.length) {
        //     return new QueryDashboardListResponse();
        // }

        let resp = await this.list({
            tagIds: null,
            searchName: '',
            creator: '',
            dashboardIds,
            pageSize: param.pageSize,
            pageIndex: param.pageIndex,
            orderBys: param.orderBys,
            draftStatus: null
        }, userSession);

        return resp;    
    }

    async findDashboardExtByPK(id: number): Promise<DashboardExt> {
        return await this.dextRepo.findOne( { where: {id}});
    }

    async updateDashboardPreviewImgUrl(id: number, previewImgUrl: string) {
        await this.dextRepo.update({id}, { previewImg: previewImgUrl });
    }
    
    async getDataSets():Promise<ReportCard[]>{
        let queryBuilder = await this.dataSetRepo.createQueryBuilder('dataset');
        let records =await queryBuilder.leftJoinAndSelect(Collection,'ctn','ctn.id=dataset.collection_id')
                                       .where('dataset.dataset = TRUE')
                                       .andWhere('dataset.result_metadata IS NOT NULL')
                                       .andWhere('dataset.archived = FALSE')
                                       .orderBy('dataset.name','ASC')
                                       .select(`concat('card__',dataset.id) as id ,dataset.database_id as db_id,dataset.name as display_name,dataset.table_id,dataset.description,ctn.name as schema`)
                                       .getRawMany();

        return records;
        
    }
}

