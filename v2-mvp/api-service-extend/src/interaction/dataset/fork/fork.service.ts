import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { W3Logger } from 'src/base/log/logger.service';
import { RepositoryConsts } from 'src/base/orm/repositoryConsts';

import { Repository } from 'typeorm';
import { EventService } from 'src/event-bus/event.service';
import { JWTAuthService } from 'src/base/auth/jwt-auth.service';
import { ForkDatasetResponse } from './model/ForkDatasetResponse';
import { MBConnectService } from 'src/mb-connect/mb-connect.service';
import { DatasetForkLog } from 'src/base/entity/platform-dataset/DatasetForkLog';
import { DatasetExt } from 'src/base/entity/platform-dataset/DatasetExt';
@Injectable()
export class ForkService {


    logger: W3Logger;
    constructor(
        private readonly mbConnectService: MBConnectService,
        private readonly eventService: EventService,
        private readonly jwtService: JWTAuthService,
        @Inject(RepositoryConsts.REPOSITORYS_PLATFORM.PLATFORM_DATASET_FORK_LOG_REPOSITORY.provide)
        private dforklRepo: Repository<DatasetForkLog>,


        @Inject(RepositoryConsts.REPOSITORYS_PLATFORM.PLATFORM_DATASET_EXT_REPOSITORY.provide)
        private extRepo: Repository<DatasetExt>,

    ) {
        this.logger = new W3Logger(`ForkService`);
    }

    async doFork(datasetId: number, loginAccountId: string, loginUserEmail: string): Promise<ForkDatasetResponse> {

        const target = await this.extRepo.findOne({where: {id: datasetId}});
        if (!target || target.archived) {
            throw new BadRequestException('the dataset is not available');
        }

        const newId = await this.mbConnectService.copyDataset(datasetId, loginUserEmail)
        if (!newId) {
            throw new BadRequestException('fork failed');
        }

        const sqlResult = await this.extRepo.insert({
            id: newId,
            name: target.name,
            creatorAccountId: loginAccountId,
            createdAt: target.createdAt,
            updatedAt: target.updatedAt,
            dashboardCount: 0,
            viewCount: 0,
            shareCount: 0,
            favoriteCount: 0,
          });
          if (sqlResult.identifiers && sqlResult.identifiers.length > 0) {
            // return sqlResult.identifiers[0].toString();
            return {
                newId,
            };
          }
          throw new BadRequestException('fork failed');
    }

}
