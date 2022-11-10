import { Inject, Injectable } from '@nestjs/common';
import { DashboardExt } from 'src/base/entity/platform-dashboard/DashboardExt';
import { Account } from 'src/base/entity/platform-user/Account.entity';
import { W3Logger } from 'src/base/log/logger.service';
import { RepositoryConsts } from 'src/base/orm/repositoryConsts';
import { PageRequest } from 'src/viewModel/base/pageRequest';
import { Repository } from 'typeorm';
import { QueryTopCreatorRequest } from './model/QueryTopCreatorRequest';
import { QueryTopCreatorResponse } from './model/QueryTopCreatorResponse';

@Injectable()
export class CreatorService {

    logger: W3Logger;
    constructor(
        @Inject(RepositoryConsts.REPOSITORYS_PLATFORM.PLATFORM_DASHBOARD_EXT_REPOSITORY.provide)
        private dextRepo: Repository<DashboardExt>,) {
        this.logger = new W3Logger(`CreatorService`);
    }


    async listCreators(param: QueryTopCreatorRequest): Promise<QueryTopCreatorResponse> {

        let resp: QueryTopCreatorResponse = {
            list: [],
            totalCount: 0
        }
        let query_count = await this.dextRepo.createQueryBuilder("d")
            .select("COUNT(DISTINCT(creator_account_id))", "creator_account_id_count")
            .getRawOne();
        resp.totalCount = await query_count.creator_account_id_count;

        let query = await this.dextRepo.createQueryBuilder("d")
            .leftJoinAndSelect(Account, "a", "a.accountId = d.creator_account_id")
            .select(`a."nickName"`, `creator_account_name`)
            .addSelect("creator_account_id", "creator_account_id")
            .addSelect("count(1)", "dashboard_count")
            .addSelect("SUM( d.view_count )", "total_view_count")
            .addSelect("SUM( d.share_count ) ", "total_share_count")
            .addSelect("SUM( d.fork_count )", "total_fork_count")
            .addSelect("SUM( d.favorite_count )", "total_favorite_count")
            .addSelect("COALESCE( max(a.followed_account_count),0)", "followed_account_count")
            .groupBy("d.creator_account_id")
            .addGroupBy(`a."nickName"`)


        if (param.orderBys && param.orderBys.length > 0) {
            query = query.orderBy(param.orderBys[0].sort, param.orderBys[0].order);
        } else {
            query = query.orderBy("dashboard_count", "DESC");
        }

        query = query.take(PageRequest.getTake(param))
            .skip(PageRequest.getSkip(param))



        let records = await query.getRawMany();
        this.logger.log(records);

        for (const t of records) {
            resp.list.push({
                creator_account_id: t.creator_account_id,
                creator_account_name: t.creator_account_name,
                dashboard_count: t.dashboard_count,
                total_view_count: t.total_view_count,
                total_share_count: t.total_share_count,
                total_fork_count: t.total_fork_count,
                total_favorite_count: t.total_favorite_count,
                followed_account_count: t.followed_account_count,
            })
        }

        return resp;
    }

}
