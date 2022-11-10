import { Inject, Injectable } from '@nestjs/common';
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
import { MyFollowerResponse } from './model/MyFollowerResponse';
import { UnFollowAccountRequest } from './model/UnFollowAccountRequest';
import { UnFollowAccountResponse } from './model/UnFollowAccountResponse';
@Injectable()
export class FollowService {
    logger: W3Logger;
    constructor(
        private readonly eventService: EventService,

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
            list: records[0],
            totalCount: records[1]
        };
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
            list: records[0],
            totalCount: records[1]
        };
        return resp;
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
