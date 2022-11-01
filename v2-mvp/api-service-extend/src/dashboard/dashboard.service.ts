import { Inject, Injectable } from '@nestjs/common';
import { DashboardFavorite } from 'src/base/entity/metabase/DashboardFavorite';
import { ReportDashboard } from 'src/base/entity/metabase/ReportDashboard';
import { ConfigTag } from 'src/base/entity/platform-config/ConfigTag';
import { DashboardExt } from 'src/base/entity/platform-dashboard/DashboardExt';
import { DashboardFavoriteLog } from 'src/base/entity/platform-dashboard/DashboardFavoriteLog';
import { DashboardForkLog } from 'src/base/entity/platform-dashboard/DashboardForkLog';
import { DashboardShareLog } from 'src/base/entity/platform-dashboard/DashboardShareLog';
import { DashboardViewLog } from 'src/base/entity/platform-dashboard/DashboardViewLog';
import { DashboardTag } from 'src/base/entity/platform-dashboard/DashboradTag';
import { Account } from 'src/base/entity/platform-user/Account.entity';
import { W3Logger } from 'src/base/log/logger.service';
import { RepositoryConsts } from 'src/base/orm/repositoryConsts';
import { PageRequest } from 'src/viewModel/base/pageRequest';
import { DashboardSummary } from 'src/viewModel/dashboard/DashboardSummary';
import { QueryDashboardListRequest } from 'src/viewModel/dashboard/QueryDashboardListRequest';
import { QueryDashboardListResponse } from 'src/viewModel/dashboard/QueryDashboardListResponse';
import { FindConditions, FindManyOptions, In, Like, Repository } from 'typeorm';

@Injectable()
export class DashboardService {

    logger: W3Logger;

    constructor(

        @Inject(RepositoryConsts.REPOSITORYS_PLATFORM.PLATFORM_ACCOUNT_REPOSITORY.provide)
        private accountRepo: Repository<Account>,

        @Inject(RepositoryConsts.REPOSITORYS_METABASE.MB_REPORT_DASHBOARD_REPOSITORY.provide)
        private mb_rdRepo: Repository<ReportDashboard>,

        @Inject(RepositoryConsts.REPOSITORYS_PLATFORM.PLATFORM_CONFIG_TAG_REPOSITORY.provide)
        private ctagRepo: Repository<ConfigTag>,

        @Inject(RepositoryConsts.REPOSITORYS_PLATFORM.PLATFORM_DASHBOARD_EXT_REPOSITORY.provide)
        private dextRepo: Repository<DashboardExt>,
        @Inject(RepositoryConsts.REPOSITORYS_PLATFORM.PLATFORM_DASHBOARD_FAVORITE_LOG_REPOSITORY.provide)
        private dfavlRepo: Repository<DashboardFavoriteLog>,
        @Inject(RepositoryConsts.REPOSITORYS_PLATFORM.PLATFORM_DASHBOARD_FORK_LOG_REPOSITORY.provide)
        private dforklRepo: Repository<DashboardForkLog>,
        @Inject(RepositoryConsts.REPOSITORYS_PLATFORM.PLATFORM_DASHBOARD_SHARE_LOG_REPOSITORY.provide)
        private dsharelRepo: Repository<DashboardShareLog>,
        @Inject(RepositoryConsts.REPOSITORYS_PLATFORM.PLATFORM_DASHBOARD_VIEW_LOG_REPOSITORY.provide)
        private dviewlRepo: Repository<DashboardViewLog>,
        @Inject(RepositoryConsts.REPOSITORYS_PLATFORM.PLATFORM_DASHBOARD_TAG_REPOSITORY.provide)
        private dtagRepo: Repository<DashboardTag>,
    ) {
        this.logger = new W3Logger(`DashboardService`);
    }

    async listAllTags(request: Object): Promise<ConfigTag[]> {
        let records = await this.ctagRepo.find({
            order: {
                tagName: 'ASC'
            }
        });
        return records;
    }

    async list(request: QueryDashboardListRequest): Promise<QueryDashboardListResponse> {
        // let query = `
        //         SELECT
        //             d."id",
        //             d."name",
        //             d.created_at as "createdAt",
        //             d.updated_at as "updatedAt",
        //             d.description,
        //             d.creator_id,
        //             u.login_attributes :: json ->> 'id' AS "creatorAccountId" 
        //         FROM
        //             report_dashboard d
        //             LEFT JOIN core_user u ON d.creator_id = u."id"`;

        // let result = await this.mb_rdRepo.query(query);

        let resp: QueryDashboardListResponse = new QueryDashboardListResponse();

        let filterDashboardIds: number[] = [];
        if (request.tagIds && request.tagIds.length > 0) {
            let filter_dashboard_tags = await this.dtagRepo.createQueryBuilder('t')
                .where("t.tag_id IN (:...tagIds)", { tagIds: request.tagIds })
                .addGroupBy("t.dashboard_id")
                .select("dashboard_id", "dashboardId")
                .getRawMany();

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

        if (request.dashboardIds && request.dashboardIds.length > 0) {
            for (const d of request.dashboardIds) {
                if (filterDashboardIds.indexOf(d) == -1) {
                    filterDashboardIds.push(d);
                }
            }
        }

        let where: FindConditions<DashboardExt> = {};
        if (filterDashboardIds && filterDashboardIds.length > 0) {
            where.id = In(filterDashboardIds);
        }
        if (request.searchName) {
            where.name = Like(`%${request.searchName}%`);
        }
        if (request.creator) {
            where.creatorAccountId = request.creator;
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
}

