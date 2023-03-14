import { Inject, Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { ReportCard } from 'src/base/entity/metabase/ReportCard';
import { DatasetExt } from 'src/base/entity/platform-dataset/DatasetExt';
import { W3Logger } from 'src/base/log/logger.service';
import { RepositoryConsts } from 'src/base/orm/repositoryConsts';
import { AppConfig } from 'src/base/setting/appConfig';
import { CronConstants } from 'src/cron.constants';
import { MBConnectService } from 'src/mb-connect/mb-connect.service';
import { In, Repository } from 'typeorm';

@Injectable()
export class Job_SyncDatasetFromMB {
  private isJobRunning = false;
  logger: W3Logger;

  constructor(
    private readonly mbConnectService: MBConnectService,

    @Inject(
      RepositoryConsts.REPOSITORYS_PLATFORM.PLATFORM_DATASET_EXT_REPOSITORY
        .provide,
    )
    private datasetExtRepo: Repository<DatasetExt>,
  ) {
    this.logger = new W3Logger(`Job_SyncDatasetFromMB`);
 
    // for the first execution, do syncrhonization all data, after that everytime we only update the data with update_time in 5mins
    this.cron_syncDatasetFromMB(CronConstants.DEBUG_SYNC_DATASET_FROM_MB_INTERVAL.enabled);
  }
  @Cron(CronConstants.DEBUG_SYNC_DATASET_FROM_MB_INTERVAL.cron)
  async cron_syncDatasetFromMB(isSyncAll = false): Promise<any> {
      if (!isSyncAll && !CronConstants.DEBUG_SYNC_DATASET_FROM_MB_INTERVAL.enabled) {
          this.logger.warn("cron job [Job_SyncDatasetFromMB] is not enabled, aborting job...");
          return;
      }
      if (this.isJobRunning) {
          this.logger.warn("cron job [Job_SyncDatasetFromMB] is running, aborting new job...");
          return;
      } else {
          this.isJobRunning = true;
          this.logger.log("cron job [Job_SyncDatasetFromMB] start to run");
      }

      try {
          await this.syncDatasetFromMB(undefined, isSyncAll);
      } catch (error) {
          console.log(error);
          this.logger.error(error);

      }
      finally {
          this.isJobRunning = false;
          this.logger.log("cron job [Job_SyncDatasetFromMB] finished");
      }
  }

  async syncDatasetFromMB(dataset_id?: number, isSyncAll = false): Promise<any> {
    let result = {
      new: [],
      update: [],
      remove: [],
    };
    this.logger.log('debuing..cron_syncDatasetFromMB started..' + new Date().toLocaleTimeString());

    const ids = !!dataset_id ? [dataset_id] : null;

    // unless specified isSyncAll=true(only when initiated) to fetch all, we will fetch the data with update time within 5mins.
    // when dataset_id is presented, the record with the dataset_id has been updated and the update_time must be within 5mins.
    const list = await this.mbConnectService.findDatasets(ids, false, isSyncAll ? undefined: 5);
    const creatorIdMap = {};
    const insertAnyway = async (dataset: ReportCard, dashboardCount) => {
      let creatorAccountId = creatorIdMap[dataset.creatorId];
      if (!creatorIdMap[dataset.creatorId]) {
        creatorIdMap[dataset.creatorId] = creatorAccountId = await this.mbConnectService.findCreatorAccountIdByUserId(dataset.creatorId);
      }

      // Allow failed items to be retried, so no transaction manager here
      // Not use upsert because i don't want the field, viewCount eg., to be overwrited with 0.
      const sqlResult = await this.datasetExtRepo.insert({
        id: dataset.id,
        name: dataset.name,
        creatorAccountId: creatorAccountId,
        createdAt: dataset.createdAt,
        updatedAt: dataset.updatedAt,
        dashboardCount,
        viewCount: 0,
        shareCount: 0,
        favoriteCount: 0,
        forkCount: 0,
        publicUUID: dataset.publicUuid,
        publicLink: !dataset.publicUuid ? '' : this.formatlink(dataset.id)
      });
      if (sqlResult.identifiers && sqlResult.identifiers.length > 0) {
        result.new.push(dataset.id);
      }
    };
    for (const dataset of list) {
      const dashboardCount = await this.mbConnectService.countLinkedDashboardOfDataset(dataset.id);
      try {
        await insertAnyway(dataset, dashboardCount);
      } catch (e) {
        // maybe duplicated execption, so we just try to update(it still would be fine if update failed)
        const sqlResp = await this.datasetExtRepo
          .createQueryBuilder()
          .update()
          .set({
            updatedAt: dataset.updatedAt,
            archived: dataset.archived,
            dashboardCount,
            publicUUID: dataset.publicUuid,
            publicLink: !dataset.publicUuid ? '' : this.formatlink(dataset.id)
          })
          .where('id = :id', { id: dataset.id })
          .execute();
        if (sqlResp.affected > 0) {
          result.update.push(dataset.id);
        }
      }
    }
    // to sync deleted dashboard
    if (ids) {
      list && list.forEach(existed => {
        ids.splice(ids.indexOf(existed.database_id), 1);
      })
      for (const toDeleteId of ids) {
        await this.datasetExtRepo.delete(toDeleteId);
        result.remove.push(toDeleteId);
      };
    } else if (isSyncAll) {
      const ids = list.map(it => it.id);
      const result = await this.datasetExtRepo.createQueryBuilder().delete().where(`id NOT IN(${ids.toString()})`).execute();
      console.info(result);
    }

    return result;
  }

  async syncDashboardCountByDashboardId(dashboardId: number) {
    const data = await this.mbConnectService.countLinkedDashboardOfDatasetByDashboardId(dashboardId);
    for (const cardId of Object.keys(data)) {
      await this.datasetExtRepo.update(cardId, { dashboardCount: data[cardId] });
    }
  }
  async syncDashboardCountByDatasetId(datasetId: number) {
    const data = await this.mbConnectService.countLinkedDashboardOfDataset(datasetId);
    await this.datasetExtRepo.update(datasetId, { dashboardCount: data });
  }

  private formatlink(datasetId: number): string {
    //V1 eg: https://dev-v2.web3go.xyz/public/dashboard/dfc5d3a9-1d64-422b-b26f-0367e0fb1170
    //V2 eg: http://dev-v2.web3go.xyz/layout/dashboardDetail/1a7901e5-c9f4-4c24-ab71-8c70af1e6e0b
    if (datasetId) {
        return `${AppConfig.BASE_WEB_URL}/layout/datasetDetail/${datasetId}`;
    }
    else {
        return '';
    }
}

}
