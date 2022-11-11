import { Inject, Injectable } from '@nestjs/common';
import { ReportDashboard } from 'src/base/entity/metabase/ReportDashboard';
import { W3Logger } from 'src/base/log/logger.service';
import { RepositoryConsts } from 'src/base/orm/repositoryConsts';
import { In, Repository } from 'typeorm';

@Injectable()
export class MBConnectService {


    logger: W3Logger;

    constructor(
        @Inject(RepositoryConsts.REPOSITORYS_METABASE.MB_REPORT_DASHBOARD_REPOSITORY.provide)
        private mb_rdRepo: Repository<ReportDashboard>,

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
}
