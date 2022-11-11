import { Inject, Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { ReportDashboard } from 'src/base/entity/metabase/ReportDashboard';
import { DashboardExt } from 'src/base/entity/platform-dashboard/DashboardExt';
import { W3Logger } from 'src/base/log/logger.service';
import { RepositoryConsts } from 'src/base/orm/repositoryConsts';
import { AppConfig } from 'src/base/setting/appConfig';
import { CronConstants } from 'src/cron.constants';
import { ShareItemType } from 'src/interaction/share/model/ShareItemType';
import { MBConnectService } from 'src/mb-connect/mb-connect.service';
import { Repository } from 'typeorm';

@Injectable()
export class Job_SyncDashboardFromMB {
    private isRunning = false;
    logger: W3Logger;

    constructor(
        private readonly mbConnectService: MBConnectService,

        @Inject(RepositoryConsts.REPOSITORYS_PLATFORM.PLATFORM_DASHBOARD_EXT_REPOSITORY.provide)
        private dextRepo: Repository<DashboardExt>,

    ) {
        this.logger = new W3Logger(`Job_SyncDashboardFromMB`);
    }

    @Cron(CronConstants.DEBUG_SYNC_DASHBOARD_FROM_MB_INTERVAL)
    async syncDashboardFromMB(dashboard_id: number): Promise<any> {

        if (this.isRunning) {
            this.logger.warn("syncDashboardFromMB is running, aborting new job...");
            return;
        } else {
            this.isRunning = true;
            this.logger.log("syncDashboardFromMB start to run");
        }

        try {
            let dashboard_id_synced = {
                new: [],
                update: []
            };
            let mb_dashboard_list: ReportDashboard[] = await this.mbConnectService.findDashboards(dashboard_id);


            if (mb_dashboard_list && mb_dashboard_list.length > 0) {

                for (const mb_d of mb_dashboard_list) {

                    let findDashboard = await this.dextRepo.findOne({
                        where: {
                            id: mb_d.id
                        }
                    });

                    if (findDashboard) {
                        findDashboard.name = mb_d.name;
                        findDashboard.description = mb_d.description;
                        findDashboard.publicUUID = mb_d.publicUuid;
                        findDashboard.publicLink = await this.formatlink(ShareItemType.Dashboard.toString(), mb_d.publicUuid);
                        await this.dextRepo.save(findDashboard);
                        dashboard_id_synced.update.push(mb_d.id);
                    }
                    else {

                        let creatorAccountId = await this.mbConnectService.findDashboardCreator(mb_d.id);

                        let newDashboard: DashboardExt = {
                            id: mb_d.id,
                            name: mb_d.name,
                            description: mb_d.description,
                            creatorAccountId: creatorAccountId,
                            createdAt: mb_d.createdAt,
                            updatedAt: mb_d.updatedAt,
                            publicUUID: mb_d.publicUuid,
                            publicLink: await this.formatlink(ShareItemType.Dashboard.toString(), mb_d.publicUuid),
                            viewCount: 0,
                            shareCount: 0,
                            forkCount: 0,
                            favoriteCount: 0
                        };
                        await this.dextRepo.save(newDashboard);
                        dashboard_id_synced.new.push(mb_d.id);
                    }
                }
            }

            return dashboard_id_synced;
        } catch (error) {
            console.log(error);
            this.logger.error(error);

        }
        finally {
            this.isRunning = false;
            this.logger.log("debug_syncDashboardFromMB finished");
        }
    }

    async formatlink(category: string, publicUUID: string): Promise<string> {
        //eg: https://dev-v2.web3go.xyz/public/dashboard/dfc5d3a9-1d64-422b-b26f-0367e0fb1170

        if (category && publicUUID) {
            let link = `${AppConfig.BASE_WEB_URL}/public/${category.toLowerCase()}/${publicUUID.toLowerCase()}`;

            return link;
        }
        else {
            return '';
        }
    }
}
