import { Inject, Injectable } from '@nestjs/common';
import { W3Logger } from 'src/base/log/logger.service';
import { RepositoryConsts } from 'src/base/orm/repositoryConsts';
import { PageRequest } from 'src/viewModel/base/pageRequest';
import { DatasetListRequest } from './model/DatasetListRequest';
import { FindManyOptions, FindOptionsWhere, ILike, In, Like, Not, Raw, Repository } from 'typeorm';
import { ReportCard } from 'src/base/entity/metabase/ReportCard';
import { Collection } from 'src/base/entity/metabase/Collection';
import { DatasetTagGroup } from 'src/base/entity/platform-dataset/DatasetTagGroup';
import { DatasetExt } from 'src/base/entity/platform-dataset/DatasetExt';
import { DatasetTag } from 'src/base/entity/platform-dataset/DatasetdTag';
import { DatasetDetailVO } from './model/DatasetDetailVO';
import { DatasetListResponse } from './model/DatasetListResponse';
import { DatasetDetailRequest } from './model/DatasetDetailRequest';

@Injectable()
export class DatasetService {

    logger: W3Logger;

    constructor(

        @Inject(RepositoryConsts.REPOSITORYS_PLATFORM.PLATFORM_DATASET_TAG_GROUP_REPOSITORY.provide)
        private tagGroupRepo: Repository<DatasetTagGroup>,

        @Inject(RepositoryConsts.REPOSITORYS_PLATFORM.PLATFORM_DATASET_EXT_REPOSITORY.provide)
        private dextRepo: Repository<DatasetExt>,
        @Inject(RepositoryConsts.REPOSITORYS_PLATFORM.PLATFORM_DATASET_TAG_REPOSITORY.provide)
        private dtagRepo: Repository<DatasetTag>,

        @Inject(RepositoryConsts.REPOSITORYS_METABASE.MB_REPORT_CARD_REPOSITORY.provide)
        private dataSet: Repository<ReportCard>
    ) {
        this.logger = new W3Logger(`DatasetService`);
    }


    async list(request: DatasetListRequest, userSession): Promise<DatasetListResponse> {

        let resp: DatasetListResponse = new DatasetListResponse();

        let filterDatasetIds: number[] = [];
        if (request.tagIds && request.tagIds.length > 0) {

            let filter_dataset_tags: any[];
            if (request.datasetIds && request.datasetIds.length > 0) {
                filter_dataset_tags = await this.dtagRepo.createQueryBuilder('t')
                    .where("t.tag_id IN (:...tagIds)", { tagIds: request.tagIds })
                    .andWhere("t.dataset_id IN (:...datasetIds)", { datasetIds: request.datasetIds })
                    .addGroupBy("t.dataset_id")
                    .select("dataset_id", "datasetId")
                    .getRawMany();
            }
            else {
                filter_dataset_tags = await this.dtagRepo.createQueryBuilder('t')
                    .where("t.tag_id IN (:...tagIds)", { tagIds: request.tagIds })
                    .addGroupBy("t.dataset_id")
                    .select("dataset_id", "datasetId")
                    .getRawMany();
            }


            // this.logger.debug(`filter_dataset_tags:${JSON.stringify(filter_dataset_tags)}`);
            if (filter_dataset_tags) {
                for (const d of filter_dataset_tags) {
                    filterDatasetIds.push(d.datasetId);
                }
            }

            if (!filterDatasetIds || filterDatasetIds.length == 0) {
                this.logger.warn(`no dataset for the tagIds ${JSON.stringify(request.tagIds)}`);
                return resp;
            }
        }

        if (filterDatasetIds.length == 0 && request.datasetIds && request.datasetIds.length > 0) {
            for (const d of request.datasetIds) {
                if (filterDatasetIds.indexOf(d) == -1) {
                    filterDatasetIds.push(d);
                }
            }
        }

        let where: FindOptionsWhere<DatasetExt> = {};
        if (filterDatasetIds && filterDatasetIds.length > 0) {
            where.id = In(filterDatasetIds);
        }
        if (request.searchName) {
            where.name = ILike(`%${request.searchName}%`);
        }
        if (request.creator) {
            where.creatorAccountId = request.creator;
        } else {
            // where.publicUUid = Not(''); //Not(Raw('NULL'));
            // My Space Page may vary by the log-in status
        }
        const isAllowShowingDraft = userSession && userSession.id && userSession.id === request.creator;
        // specified the defat status of a dataset, 0 or default: not limited(mixed the drafted and the posted);  1: draft data only 2: only posted(no drafts)

         if (request.draftStatus === 1) { // draft data only
            if (!isAllowShowingDraft) {
                //throw new BadRequestException('permission failed')
                // to make the query dismatch any records
                where.id = -11;
            } else {
                where.publicLink = '';
            } 
        } else if (request.draftStatus === 2) {         // only posted
            where.publicLink = Not(''); //Not(Raw('NULL'));
        } else {  // mixed
            if (!isAllowShowingDraft) { // if no auth, only show posted
                where.publicLink = Not('')
            } 
        }
        
        let options: FindManyOptions<DatasetExt> = {
            where: where,
            take: PageRequest.getTake(request),
            skip: PageRequest.getSkip(request),
        };
        if (request.orderBys && request.orderBys.length > 0) {
            options.order = {};
            request.orderBys.forEach((d) => (options.order[d.sort] = d.order));
        } else {
            options.order = {
                createdAt: 'DESC',
            };
        }

        let datasetResult = await this.dextRepo.findAndCount(options);
        resp.totalCount = datasetResult[1];
        resp.list = [];

        let records = datasetResult[0];
        if (!records || records.length == 0) {
            this.logger.warn(`no datasets found`);
            return resp;
        }
        filterDatasetIds = records.map(t => t.id);
        let datasetTags = await this.dtagRepo.find({
            where: {
                datasetId: In(filterDatasetIds)
            }
        });
        //this.logger.debug(`dataset_tags:${JSON.stringify(dataset_tags)}`);

        let filterTagIds = Array.from(new Set(datasetTags.map(t => t.tagId)));
        //this.logger.debug(`filterTagIds:${JSON.stringify(filterTagIds)}`);
        let tags = await this.tagGroupRepo.find({
            where: {
                id: In(filterTagIds)
            }
        });
        for (const record of records) {

            let d: DatasetDetailVO = {
                ...record,
                tagList: []
            }
            // this.logger.debug(`datasetSummary:${JSON.stringify(d)}`);
            for (const dt of datasetTags) {
                if (dt.datasetId == d.id) {
                    let findTag = tags.find(t => t.id == dt.tagId);
                    // this.logger.debug(`findTag:${JSON.stringify(findTag)}`);
                    if (findTag) {
                        d.tagList.push(findTag);
                    }
                }
            }

            resp.list.push(d);

        }

        return resp;
    }

    async detail(request: DatasetDetailRequest): Promise<{list: Array<DatasetDetailVO>}> {

        let resp = {
            list: []
        }

        let options: FindManyOptions<DatasetExt> = {
            where: {
                id: In(request.datasetIds)
            },
            order: {
                id: 'ASC'
            }
        };

        let records = await this.dextRepo.find(options);

        if (!records || records.length == 0) {
            this.logger.warn(`no datasets found`);
            return resp;
        }
        let filterDatasetIds = records.map(t => t.id);
        let dataset_tags = await this.dtagRepo.find({
            where: {
                datasetId: In(filterDatasetIds)
            }
        });
        //this.logger.debug(`dataset_tags:${JSON.stringify(dataset_tags)}`);

        let filterTagIds = Array.from(new Set(dataset_tags.map(t => t.tagId)));
        //this.logger.debug(`filterTagIds:${JSON.stringify(filterTagIds)}`);
        let tags = await this.tagGroupRepo.find({
            where: {
                id: In(filterTagIds)
            }
        });
        for (const record of records) {

            let d: DatasetDetailVO = {
                ...record,
                tagList: []
            }
            // this.logger.debug(`datasetSummary:${JSON.stringify(d)}`);
            for (const dt of dataset_tags) {
                if (dt.datasetId == d.id) {
                    let findTag = tags.find(t => t.id == dt.tagId);
                    // this.logger.debug(`findTag:${JSON.stringify(findTag)}`);
                    if (findTag) {
                        d.tagList.push(findTag);
                    }
                }
            }
            resp.list.push(d);
        }

        return resp;
    }



    async findDatasetExtByPK(id: number): Promise<DatasetExt> {
        return await this.dextRepo.findOne( { where: {id}});
    }

    async updateDatasetPreviewImgUrl(id: number, previewImgUrl: string) {
        await this.dextRepo.update({id}, { previewImg: previewImgUrl });
    }
    
}

