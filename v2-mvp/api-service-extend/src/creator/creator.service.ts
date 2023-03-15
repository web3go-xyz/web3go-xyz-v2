import { Inject, Injectable } from '@nestjs/common';
import { DashboardExt } from 'src/base/entity/platform-dashboard/DashboardExt';
import { DatasetExt } from 'src/base/entity/platform-dataset/DatasetExt';
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
        private dextRepo: Repository<DashboardExt>,
        @Inject(RepositoryConsts.REPOSITORYS_PLATFORM.PLATFORM_DATASET_EXT_REPOSITORY.provide)
        private datasetExtRepo: Repository<DatasetExt>,
        ) {
        this.logger = new W3Logger(`CreatorService`);
    }


    async listCreators(param: QueryTopCreatorRequest): Promise<QueryTopCreatorResponse> {

        let resp: QueryTopCreatorResponse = {
            list: [],
            totalCount: 0
        }
      
        let query = this.dextRepo.createQueryBuilder("d")
                .select("COUNT(DISTINCT(creator_account_id))", "creator_account_id_count");
        if (param.accountName && param.accountName.length > 0) {
            query.leftJoinAndSelect(Account, "a", "a.account_id = d.creator_account_id")
            .select("COUNT(DISTINCT(creator_account_id))", "creator_account_id_count")
            .where(`a."nick_name" LIKE :name`, {name: '%' + param.accountName + '%'});
        }
        let query_count = await query.getRawOne();
        resp.totalCount = query_count.creator_account_id_count;

        query = this.dextRepo.createQueryBuilder("d")
            .leftJoinAndSelect(Account, "a", "a.account_id = d.creator_account_id")
            .select(`a."nick_name"`, `creator_account_name`)
            .addSelect("creator_account_id", "creator_account_id")
            .addSelect("count(1)", "dashboard_count")
            .addSelect("SUM( d.view_count )", "total_view_count")
            .addSelect("SUM( d.share_count ) ", "total_share_count")
            .addSelect("SUM( d.fork_count )", "total_fork_count")
            .addSelect("SUM( d.favorite_count )", "total_favorite_count")
            .addSelect("COALESCE( max(a.followed_account_count),0)", "followed_account_count")
            .groupBy("d.creator_account_id")
            .addGroupBy(`a."nick_name"`)

        if (param.accountName && param.accountName.length > 0) {
            query.andWhere(`a."nick_name" LIKE :name`, {name: '%' + param.accountName + '%'});
        }

        if (param.orderBys && param.orderBys.length > 0) {
            query = query.orderBy(param.orderBys[0].sort, param.orderBys[0].order);
        } else {
            query = query.orderBy("dashboard_count", "DESC");
        }

        query = query.offset(PageRequest.getSkip(param))
            .limit(PageRequest.getTake(param));  // use offset and limit here , since skip/take doesn't work when join tables.

        let records = await query.getRawMany();

        const datasetStatByAccounts = await this.getDatasetStatByAccounts(records.map(it => it.creator_account_id));

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
                dataset: datasetStatByAccounts[t.creator_account_id] || {}
            })
        }
        return resp;
    }


    private async getDatasetStatByAccounts(accountIds) {
        if (!accountIds || !accountIds.length) {
            return {};
        }
        const query = this.datasetExtRepo
          .createQueryBuilder('d')
          .where('d.creator_account_id IN( :...creator_account_id)', {
            creator_account_id: accountIds,
          })
          .andWhere("d.public_link != ''")
          .select('creator_account_id', 'creator_account_id')
          .addSelect('count(1)', 'dataset_count')
          .addSelect('SUM( d.view_count )', 'total_view_count')
          .addSelect('SUM( d.share_count ) ', 'total_share_count')
          .addSelect('SUM( d.fork_count )', 'total_fork_count')
          .addSelect('SUM( d.favorite_count )', 'total_favorite_count')
          .groupBy('d.creator_account_id');
    
        let statisticRecords = await query.getRawMany();
        const resp = {}; 
        for (const stat of statisticRecords) {
          resp[stat.creator_account_id] = {
            count: Number(stat.dataset_count) || 0,
            total_view_count: Number(stat.total_view_count),
            total_share_count: Number(stat.total_share_count),
            total_fork_count: Number(stat.total_fork_count),
            total_favorite_count: Number(stat.total_favorite_count),
          };;
        }
        return resp;
      }
}
