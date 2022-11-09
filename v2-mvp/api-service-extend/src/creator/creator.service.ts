import { Inject, Injectable } from '@nestjs/common';
import { DashboardExt } from 'src/base/entity/platform-dashboard/DashboardExt';
import { W3Logger } from 'src/base/log/logger.service';
import { RepositoryConsts } from 'src/base/orm/repositoryConsts';
import { Repository } from 'typeorm';

@Injectable()
export class CreatorService {
    logger: any;
    constructor(
        @Inject(RepositoryConsts.REPOSITORYS_PLATFORM.PLATFORM_DASHBOARD_EXT_REPOSITORY.provide)
        private dextRepo: Repository<DashboardExt>,) {
        this.logger = new W3Logger(`CreatorService`);
    }
    async listAllCreators(param: Object): Promise<string[]> {
        let records = await this.dextRepo.createQueryBuilder("d")

            .select("creator_account_id", "creatorAccountId")
            .distinct()
            .orderBy("creator_account_id")
            .getRawMany();
        console.log(records);

        return records.map(t => t.creatorAccountId);

    }

}
