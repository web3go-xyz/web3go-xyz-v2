import { Inject, Injectable } from '@nestjs/common';
import { AccountInfoService } from 'src/account/info/account-info.service';
import { AccountFollower } from 'src/base/entity/platform-user/AccountFollower';
import { W3Logger } from 'src/base/log/logger.service';
import { RepositoryConsts } from 'src/base/orm/repositoryConsts';
import { EventService } from 'src/event-bus/event.service';
import { AccountEventTopic } from 'src/event-bus/model/account/AccountEventTopic';
import { PageRequest } from 'src/viewModel/base/pageRequest';
import { Repository } from 'typeorm';
import { FollowAccountRequest } from './model/FollowAccountRequest';
import { FollowAccountResponse } from './model/FollowAccountResponse';
import { MyFollowerRequest } from './model/MyFollowerRequest';
import { AccountFollowerDetail, MyFollowerResponse } from './model/MyFollowerResponse';
import { UnFollowAccountRequest } from './model/UnFollowAccountRequest';
import { UnFollowAccountResponse } from './model/UnFollowAccountResponse';
@Injectable()
export class FollowService {
    logger: W3Logger;
    constructor(
        private readonly eventService: EventService,
        private readonly accountInfoService: AccountInfoService,
        @Inject(RepositoryConsts.REPOSITORYS_PLATFORM.PLATFORM_ACCOUNT_FOLLOWER_REPOSITORY.provide)
        private afRepo: Repository<AccountFollower>,
    ) {
        this.logger = new W3Logger(`FollowService`);
    }

    async listFollowed(param: MyFollowerRequest, accountId: string): Promise<MyFollowerResponse> {
        let records = await this.afRepo.findAndCount({
            where: {
                followedAccountId: accountId
            },
            select: ['accountId', 'createdAt'],
            order: {
                createdAt: 'DESC'
            },
            take: PageRequest.getTake(param),
            skip: PageRequest.getSkip(param)
        });
        let resp: MyFollowerResponse = {
            list: [],
            totalCount: records[1]
        };
        let followList = records[0];
        if (followList && followList.length > 0) {
            let accountIds = followList.map(t => t.accountId)
            resp.list = await this.patchDetails(accountIds, param.includeDetail);
        }
        return resp;
    }
    async listFollowing(param: MyFollowerRequest, accountId: string): Promise<MyFollowerResponse> {
        let records = await this.afRepo.findAndCount({
            where: {
                accountId: accountId
            },
            select: ['followedAccountId', 'createdAt'],
            order: {
                createdAt: 'DESC'
            },
            take: PageRequest.getTake(param),
            skip: PageRequest.getSkip(param)
        });
        let resp: MyFollowerResponse = {
            list: [],
            totalCount: records[1]
        };
        let followList = records[0];
        if (followList && followList.length > 0) {
            let accountIds = followList.map(t => t.followedAccountId);
            resp.list = await this.patchDetails(accountIds, param.includeDetail);
        }
        return resp;
    }
    // TODO TO TEST
    async patchDetails(accountIds: string[], includeDetail: boolean): Promise<AccountFollowerDetail[]> {
        let list: AccountFollowerDetail[] = [];

        if (!includeDetail) {
            for (const aId of accountIds) {
                list.push({
                    accountId: aId,
                    nickName: '',
                    avatar: '',
                    followedAccountCount: 0,
                    followingAccountCount: 0,
                    dashboard_count: 0,
                    total_share_count: 0,
                    total_view_count: 0,
                    total_favorite_count: 0,
                    total_fork_count: 0
                });
            }

            return list;
        }


        let accountInfos = await this.accountInfoService.getAccountInfo(accountIds, false);
        let accountStatistics = await this.accountInfoService.getAccountStatistic(accountIds);
        if (accountInfos && accountInfos.length > 0) {

            for (const ad of accountInfos) {
                let newItem: AccountFollowerDetail = {
                    accountId: ad.account.accountId,
                    nickName: ad.account.nickName,
                    avatar: ad.account.avatar,
                    followedAccountCount: 0,
                    followingAccountCount: 0,
                    dashboard_count: 0,
                    total_share_count: 0,
                    total_view_count: 0,
                    total_favorite_count: 0,
                    total_fork_count: 0
                }
                let findAccountStatistics = accountStatistics.find(t => t.accountId == ad.account.accountId);
                if (findAccountStatistics) {
                    newItem.followedAccountCount = findAccountStatistics.followedAccountCount;
                    newItem.followingAccountCount = findAccountStatistics.followingAccountCount;
                    newItem.dashboard_count = findAccountStatistics.count;
                    newItem.total_share_count = findAccountStatistics.total_share_count;
                    newItem.total_view_count = findAccountStatistics.total_view_count;
                    newItem.total_favorite_count = findAccountStatistics.total_favorite_count;
                    newItem.total_fork_count = findAccountStatistics.total_fork_count;
                }
                list.push(newItem);
            }
        }

        return list;
    }

    async unfollow(param: UnFollowAccountRequest, accountId: string): Promise<UnFollowAccountResponse> {

        let resp: UnFollowAccountResponse = {};

        let record = await this.afRepo.findOne({
            where: {
                accountId: accountId,
                followedAccountId: param.targetAccountId,
            }
        });
        if (record) {
            await this.afRepo.remove(record);
            resp.msg = 'removed';

            this.eventService.fireEvent({
                topic: AccountEventTopic.unfollowAccount,
                data: {
                    accountId: accountId,
                    targetAccountId: param.targetAccountId,
                }
            });

        }
        else {
            resp.msg = 'nothing';
        }
        return resp;
    }
    async follow(param: FollowAccountRequest, accountId: string): Promise<FollowAccountResponse> {
        let resp: FollowAccountResponse = {
            msg: ''
        };

        let record = await this.afRepo.findOne({
            where: {
                accountId: accountId,
                followedAccountId: param.targetAccountId,
            }
        });
        if (!record) {
            record = {
                accountId: accountId,
                followedAccountId: param.targetAccountId,
                createdAt: new Date()
            }
            await this.afRepo.save(record);
            resp.msg = 'new';

            this.eventService.fireEvent({
                topic: AccountEventTopic.followAccount,
                data: {
                    accountId: accountId,
                    targetAccountId: param.targetAccountId,
                }
            });
        }
        else {
            resp.msg = 'nothing';
        }
        return resp;
    }

}
