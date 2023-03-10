import { Inject, Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { ReportDashboard } from 'src/base/entity/metabase/ReportDashboard';
import { DashboardExt } from 'src/base/entity/platform-dashboard/DashboardExt';
import { W3Logger } from 'src/base/log/logger.service';
import { RepositoryConsts } from 'src/base/orm/repositoryConsts';
import { AppConfig } from 'src/base/setting/appConfig';
import { CronConstants } from 'src/cron.constants';
import { ShareItemType } from 'src/interaction/dashboard/share/model/ShareItemType';
import { MBConnectService } from 'src/mb-connect/mb-connect.service';
import { In, Repository } from 'typeorm';

@Injectable()
export class Job_SyncDashboardFromMB {
    private isJobRunning = false;
    logger: W3Logger;

    constructor(
        private readonly mbConnectService: MBConnectService,

        @Inject(RepositoryConsts.REPOSITORYS_PLATFORM.PLATFORM_DASHBOARD_EXT_REPOSITORY.provide)
        private dextRepo: Repository<DashboardExt>,

    ) {
        this.logger = new W3Logger(`Job_SyncDashboardFromMB`);
    }
    @Cron(CronConstants.DEBUG_SYNC_DASHBOARD_FROM_MB_INTERVAL.cron)
    async cron_syncDashboardFromMB(): Promise<any> {
        if (!CronConstants.DEBUG_SYNC_DASHBOARD_FROM_MB_INTERVAL.enabled) {
            this.logger.warn("cron job [Job_SyncDashboardFromMB] is not enabled, aborting job...");
            return;
        }
        if (this.isJobRunning) {
            this.logger.warn("cron job [Job_SyncDashboardFromMB] is running, aborting new job...");
            return;
        } else {
            this.isJobRunning = true;
            this.logger.log("cron job [Job_SyncDashboardFromMB] start to run");
        }

        try {
            await this.syncDashboardFromMB();
        } catch (error) {
            console.log(error);
            this.logger.error(error);

        }
        finally {
            this.isJobRunning = false;
            this.logger.log("cron job [Job_SyncDashboardFromMB] finished");
        }
    }

    async syncDashboardFromMB(dashboard_id?: number): Promise<any> {

        try {
            let dashboard_id_synced = {
                new: [],
                update: [],
                remove: []
            };
            let mb_dashboard_list: ReportDashboard[] = [];
            let existing_dashboardExt_list: DashboardExt[] = [];
            let excludeArchived = true;
            if (dashboard_id && dashboard_id > 0) {
                mb_dashboard_list = await this.mbConnectService.findDashboards([dashboard_id], excludeArchived);
                existing_dashboardExt_list = await this.dextRepo.find({
                    where: {
                        id: In([dashboard_id])
                    }
                });
            }
            else {
                mb_dashboard_list = await this.mbConnectService.findAllDashboards(excludeArchived);
                existing_dashboardExt_list = await this.dextRepo.find();
            }

            let newDashboards = mb_dashboard_list.filter(v => {
                return existing_dashboardExt_list.findIndex(t => t.id == v.id) == -1;
            });
            let updateDashboards = mb_dashboard_list.filter(v => {
                return existing_dashboardExt_list.findIndex(t => t.id == v.id) > -1;
            });
            let removedDashboards = existing_dashboardExt_list.filter(v => {
                return mb_dashboard_list.findIndex(t => t.id == v.id) == -1;
            });


            if (newDashboards) {
                for (const newD of newDashboards) {
                    let creatorAccountId = await this.mbConnectService.findCreatorAccountIdByUserId(newD.creatorId);

                    let newDashboard: DashboardExt = {
                        id: newD.id,
                        name: newD.name,
                        description: newD.description,
                        creatorAccountId: creatorAccountId,
                        createdAt: newD.createdAt,
                        updatedAt: newD.updatedAt,
                        publicUUID: newD.publicUuid,
                        publicLink: await this.formatlink(ShareItemType.Dashboard.toString(), newD.publicUuid),
                        viewCount: 0,
                        shareCount: 0,
                        forkCount: 0,
                        favoriteCount: 0
                    };
                    await this.dextRepo.insert(newDashboard);
                    dashboard_id_synced.new.push(newD.id);
                }
            }

            if (updateDashboards) {
                for (const updateD of updateDashboards) {

                    let findDashboard = existing_dashboardExt_list.find(t => t.id == updateD.id);
                    await this.dextRepo.update(findDashboard.id, {
                        name: updateD.name,
                        description: updateD.description,
                        publicUUID: updateD.publicUuid,
                        publicLink: await this.formatlink(ShareItemType.Dashboard.toString(), updateD.publicUuid)
                    });
                    dashboard_id_synced.update.push(updateD.id);
                }
            }

            if (removedDashboards) {
                for (const removedD of removedDashboards) {
                    let findDashboard = existing_dashboardExt_list.find(t => t.id == removedD.id);
                    await this.dextRepo.delete(findDashboard.id);
                    dashboard_id_synced.remove.push(removedD.id);
                }
            }

            return dashboard_id_synced;
        } catch (error) {
            console.log(error);
            this.logger.error(error);
        }
        finally {
            this.logger.log("syncDashboardFromMB finished");
        }
    }

    private async formatlink(category: string, publicUUID: string): Promise<string> {
        //V1 eg: https://dev-v2.web3go.xyz/public/dashboard/dfc5d3a9-1d64-422b-b26f-0367e0fb1170
        //V2 eg: http://dev-v2.web3go.xyz/layout/dashboardDetail/1a7901e5-c9f4-4c24-ab71-8c70af1e6e0b
        if (category && publicUUID) {
            let link = `${AppConfig.BASE_WEB_URL}/layout/dashboardDetail/${publicUUID.toLowerCase()}`;

            return link;
        }
        else {
            return '';
        }
    }
}
