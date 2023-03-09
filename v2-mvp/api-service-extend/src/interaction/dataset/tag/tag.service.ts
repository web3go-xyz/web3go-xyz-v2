import { Inject, Injectable } from '@nestjs/common';
import { DatasetTag } from 'src/base/entity/platform-dataset/DatasetdTag';
import { DatasetTagGroup } from 'src/base/entity/platform-dataset/DatasetTagGroup';
import { W3Logger } from 'src/base/log/logger.service';
import { RepositoryConsts } from 'src/base/orm/repositoryConsts';
import { Repository } from 'typeorm';
import { AddTag4DatasetRequest } from './model/AddTag4DatasetRequest';
import { AddTag4DatasetResponse } from './model/AddTag4DatasetResponse';
import { MarkTag4DatasetRequest } from './model/MarkTag4DatasetRequest';
import { MarkTag4DatasetResponse } from './model/MarkTag4DatasetResponse';
import { RemoveTag4DatasetRequest } from './model/RemoveTag4DatasetRequest';
import { RemoveTag4DatasetResponse } from './model/RemoveTag4DatasetResponse';

@Injectable()
export class TagService {
  logger: W3Logger;

  constructor(
    @Inject(
      RepositoryConsts.REPOSITORYS_PLATFORM
        .PLATFORM_DATASET_TAG_GROUP_REPOSITORY.provide,
    )
    private ctagRepo: Repository<DatasetTagGroup>,

    @Inject(
      RepositoryConsts.REPOSITORYS_PLATFORM.PLATFORM_DATASET_TAG_REPOSITORY
        .provide,
    )
    private dtagRepo: Repository<DatasetTag>,
  ) {
    this.logger = new W3Logger(`DatasetTagService`);
  }

  async listAllTags(): Promise<DatasetTagGroup[]> {
    let records = await this.ctagRepo.find({
      select: ['id', 'tagName'],
      order: {
        tagName: 'ASC',
      },
    });
    return records;
  }
  async listDatasetTags(id: number) {
    let queryBuilder = await this.dtagRepo.createQueryBuilder('data');
    let records = await queryBuilder
      .innerJoinAndSelect(DatasetTagGroup, 'config', 'config.id=data.tagId')
      .where('data.datasetId=:id', { id })
      .orderBy('data.createdAt', 'ASC')
      .select(`config.id,config.tag_name`)
      .getRawMany();

    return records;
  }

  async removeTags(
    param: RemoveTag4DatasetRequest,
    accountId: string,
  ): Promise<RemoveTag4DatasetResponse> {
    let resp: RemoveTag4DatasetResponse = {
      msg: '',
    };
    let removedTagIds: number[] = [];
    await this.dtagRepo.manager.transaction(
      async (transactionalEntityManager) => {
        for (const tagId of param.tagIds) {
          let record = await this.dtagRepo.findOne({
            where: {
              creator: accountId,
              datasetId: param.datasetId,
              tagId: tagId,
            },
          });
          if (record) {
            const removeTag =
              await transactionalEntityManager.remove<DatasetTag>(record);
            if (removeTag) {
              removedTagIds.push(tagId);
            }
          }
        }
      },
    );
    resp.msg = removedTagIds.join(',');
    return resp;
  }
  async markTags(
    param: MarkTag4DatasetRequest,
    accountId: string,
  ): Promise<MarkTag4DatasetResponse> {
    let resp: MarkTag4DatasetResponse = {
      msg: '',
    };
    let newTagIds: number[] = [];
    for (const tagId of param.tagIds) {
      let record = await this.dtagRepo.findOne({
        where: {
          creator: accountId,
          datasetId: param.datasetId,
          tagId: tagId,
        },
      });
      if (!record) {
        let newTag: DatasetTag = {
          datasetId: param.datasetId,
          tagId: tagId,
          createdAt: new Date(),
          creator: accountId,
        };
        await this.dtagRepo.save(newTag);
        newTagIds.push(tagId);
      }
    }
    resp.msg = newTagIds.join(',');
    return resp;
  }

  async addTag(
    param: AddTag4DatasetRequest,
    accountId: string,
  ): Promise<AddTag4DatasetResponse> {
    let resp: AddTag4DatasetResponse = {
      data: {},
    };
    let tagName = param.tagName.trim();
    let tagId = param.tagId;
    await this.ctagRepo.manager.transaction(
      async (transactionalEntityManager) => {
        if (tagName) {
          let tagRecord = await this.ctagRepo.findOne({
            where: {
              tagName,
            },
          });
          if (!tagRecord) {
            let newTag: DatasetTagGroup = new DatasetTagGroup();
            Object.assign(newTag, {
              tagName,
              tagDescription: tagName,
              createdAt: new Date(),
              creator: accountId,
            } as DatasetTagGroup);
            tagRecord = await transactionalEntityManager.save<DatasetTagGroup>(
              newTag,
            );
          }
          tagId = tagRecord.id;
        }
        let record = null;
        if (tagId) {
          record = await this.dtagRepo.findOne({
            where: {
              creator: accountId,
              datasetId: param.datasetId,
              tagId,
            },
          });
          if (!record) {
            let newTag: DatasetTag = new DatasetTag();
            Object.assign(newTag, {
              datasetId: param.datasetId,
              tagId: tagId,
              createdAt: new Date(),
              creator: accountId,
            });
            await transactionalEntityManager.save<DatasetTag>(newTag);

            resp.data = { tagName, tagId };
          }
        }
      },
    );
    return resp;
  }
}
