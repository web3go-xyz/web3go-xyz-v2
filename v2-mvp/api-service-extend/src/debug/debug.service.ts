import { Inject, Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { ReportDashboard } from 'src/base/entity/metabase/ReportDashboard';
import { DashboardExt } from 'src/base/entity/platform-dashboard/DashboardExt';
import { AccountVerifyCode } from 'src/base/entity/platform-user/AccountVerifyCode.entity';
import { W3Logger } from 'src/base/log/logger.service';
import { RepositoryConsts } from 'src/base/orm/repositoryConsts';
import { CronConstants } from 'src/cron.constants';
import { Job_SyncDashboardFromMB } from 'src/jobs/job.syncDashboardFromMB';
import { Repository } from 'typeorm';

@Injectable()
export class DebugService {
    logger: W3Logger;

    constructor(
        @Inject(RepositoryConsts.REPOSITORYS_PLATFORM.PLATFORM_ACCOUNT_VERIFYCODE_REPOSITORY.provide)
        private accountVerifyCodeRepository: Repository<AccountVerifyCode>,

        private job_SyncDashboardFromMB: Job_SyncDashboardFromMB

    ) {
        this.logger = new W3Logger(`DebugService`);
    }

    async DEBUG_verifyCode(): Promise<any> {
        return await this.accountVerifyCodeRepository.find({
            order: {
                created_time: 'DESC'
            },
            take: 50
        });
    }

    async debug_syncDashboardFromMB(dashboard_id: number): Promise<any> {
        return this.job_SyncDashboardFromMB.syncDashboardFromMB(dashboard_id);
    }
}
