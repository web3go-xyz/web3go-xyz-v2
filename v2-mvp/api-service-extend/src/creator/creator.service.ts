import { Inject, Injectable } from '@nestjs/common';
import { DashboardExt } from 'src/base/entity/platform-dashboard/DashboardExt';
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
    async listAllCreators(param: Object): Promise<string[]> {
        let records = await this.dextRepo.createQueryBuilder("d")

            .select("creator_account_id", "creator_account_id")
            .distinct()
            .orderBy("creator_account_id")
            .getRawMany();
        // this.logger.log(records);

        return records.map(t => t.creator_account_id);

    }

    async listTopCreators(param: QueryTopCreatorRequest): Promise<QueryTopCreatorResponse> {

        let query = await this.dextRepo.createQueryBuilder("d")
            .groupBy("d.creator_account_id")
            .select("count(1)", "dashboard_count")
            .addSelect("creator_account_id", "creator_account_id")
            .orderBy("dashboard_count", "DESC")
            .take(PageRequest.getTake(param))
            .skip(PageRequest.getSkip(param))


        let resp: QueryTopCreatorResponse = {
            list: [],
            totalCount: 0
        }
        resp.totalCount = await query.getCount();

        let records = await query.getRawMany();
        this.logger.log(records);

        for (const t of records) {
            resp.list.push({
                creatorAccountId: t.creator_account_id,
                dashboardCount: t.dashboard_count
            })
        }

        return resp;
    }

}
