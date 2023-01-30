
import { Inject, Injectable } from '@nestjs/common';
import { ConfigTag } from 'src/base/entity/platform-config/ConfigTag';
import { DashboardTag } from 'src/base/entity/platform-dashboard/DashboradTag';
import { W3Logger } from 'src/base/log/logger.service';
import { RepositoryConsts } from 'src/base/orm/repositoryConsts';
import { Repository } from 'typeorm';
import { AddTag4DashboardRequest } from './model/AddTag4DashboardRequest';
import { AddTag4DashboardResponse } from './model/AddTag4DashboardResponse';
import { MarkTag4DashboardRequest } from './model/MarkTag4DashboardRequest';
import { MarkTag4DashboardResponse } from './model/MarkTag4DashboardResponse';
import { RemoveTag4DashboardRequest } from './model/RemoveTag4DashboardRequest';
import { RemoveTag4DashboardResponse } from './model/RemoveTag4DashboardResponse';


@Injectable()
export class TagService {

    logger: W3Logger;

    constructor(

        @Inject(RepositoryConsts.REPOSITORYS_PLATFORM.PLATFORM_CONFIG_TAG_REPOSITORY.provide)
        private ctagRepo: Repository<ConfigTag>,

        @Inject(RepositoryConsts.REPOSITORYS_PLATFORM.PLATFORM_DASHBOARD_TAG_REPOSITORY.provide)
        private dtagRepo: Repository<DashboardTag>,
    ) {
        this.logger = new W3Logger(`TagService`);
    }

    async listAllTags(): Promise<ConfigTag[]> {
        let records = await this.ctagRepo.find({
            select:['id','tagName'],
            order: {
                tagName: 'ASC'
            }
        });
        return records;
    }
    async listDashboardTags(id:number){
        let queryBuilder = await this.dtagRepo.createQueryBuilder('dashboard');
        let records =await queryBuilder.innerJoinAndSelect(ConfigTag,'config','config.id=dashboard.tagId')
                                       .where('dashboard.dashboardId=:id',{id})
                                       .orderBy('dashboard.createdAt','ASC')
                                       .select(`config.id,config.tag_name`)
                                       .getRawMany();

        return records;
    }

    async removeTags(param: RemoveTag4DashboardRequest, accountId: string): Promise<RemoveTag4DashboardResponse> {

        let resp: RemoveTag4DashboardResponse = {
            msg: ''
        };
        let removedTagIds: number[] = [];
        for (const tagId of param.tagIds) {
            let record = await this.dtagRepo.findOne({
                where: {
                    creator: accountId,
                    dashboardId: param.dashboardId,
                    tagId: tagId
                }
            });
            if (record) {
                await this.dtagRepo.remove(record);
                removedTagIds.push(tagId);
            }
        }
        resp.msg = removedTagIds.join(',');
        return resp;
    }
    async markTags(param: MarkTag4DashboardRequest, accountId: string): Promise<MarkTag4DashboardResponse> {
        let resp: MarkTag4DashboardResponse = {
            msg: ''
        };
        let newTagIds: number[] = [];
        for (const tagId of param.tagIds) {
            let record = await this.dtagRepo.findOne({
                where: {
                    creator: accountId,
                    dashboardId: param.dashboardId,
                    tagId: tagId
                }
            });
            if (!record) {

                let newTag: DashboardTag = {
                    dashboardId: param.dashboardId,
                    tagId: tagId,
                    createdAt: new Date(),
                    creator: accountId
                };
                await this.dtagRepo.save(newTag);
                newTagIds.push(tagId);

            }
        }
        resp.msg = newTagIds.join(',');
        return resp;
    }

    async addTag(param: AddTag4DashboardRequest,accountId: string): Promise<AddTag4DashboardResponse> {
        let resp: AddTag4DashboardResponse = {
          data: {},
        }
        let tagName = param.tagName.trim();
        let tagId = param.tagId;
        if (tagName) {
            let tagRecord = await this.ctagRepo.findOne({
                where: {
                tagName
                },
            });
            if (!tagRecord) {
                let newTag: ConfigTag = {
                tagName,
                tagDescription: tagName,
                createdAt: new Date(),
                creator: accountId,
                } as ConfigTag;
                tagRecord = await this.ctagRepo.save(newTag);
            }
            tagId = tagRecord.id;
        }
        let record = null;
        if (tagId) {
           record = await this.dtagRepo.findOne({
                where: {
                creator: accountId,
                dashboardId: param.dashboardId,
                tagId,
                },
            });
            if (!record) {
                let newTag: DashboardTag = {
                  dashboardId: param.dashboardId,
                  tagId: tagId,
                  createdAt: new Date(),
                  creator: accountId,
                };
                await this.dtagRepo.save(newTag);
                resp.data= {tagName,tagId};
            }

        } 

        return resp;
      }
}

