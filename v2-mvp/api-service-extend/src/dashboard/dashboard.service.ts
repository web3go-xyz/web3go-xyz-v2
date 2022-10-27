import { Inject, Injectable } from '@nestjs/common';
import { ReportDashboard } from 'src/base/entity/metabase/Report-Dashboard';
import { Account } from 'src/base/entity/platform-user/Account.entity';
import { W3Logger } from 'src/base/log/logger.service';
import { RepositoryConsts } from 'src/base/orm/repositoryConsts';
import { Repository } from 'typeorm';

@Injectable()
export class DashboardService {
    logger: W3Logger;

    constructor(

        @Inject(RepositoryConsts.REPOSITORYS_PLATFORM.PLATFORM_ACCOUNT_REPOSITORY.provide)
        private accountRepo: Repository<Account>,

        @Inject(RepositoryConsts.REPOSITORYS_METABASE.MB_REPORT_DASHBOARD_REPOSITORY.provide)
        private mb_rdRepo: Repository<ReportDashboard>,

    ) {
        this.logger = new W3Logger(`DashboardService`);
    }
    async list(request: Object): Promise<any> {
        let query = `
    SELECT
        d."id",
        d."name",
        d.created_at,
        d.updated_at,
        d.description,
        d.creator_id,
        u.login_attributes :: json ->> 'id' AS "creator_account_id" 
    FROM
        report_dashboard d
        LEFT JOIN core_user u ON d.creator_id = u."id"`;

        let result = await this.mb_rdRepo.query(query);
        return result;
        // throw new Error('Method not implemented.');
    }
}
