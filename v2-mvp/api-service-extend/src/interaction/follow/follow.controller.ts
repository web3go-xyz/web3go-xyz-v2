import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiOkResponse, ApiBearerAuth } from '@nestjs/swagger';

import { AuthorizedUser } from 'src/base/auth/AuthorizedUser';
import { JwtAuthGuard } from 'src/base/auth/decorator/JwtAuthGuard';
import { W3Logger } from 'src/base/log/logger.service';
import { FollowService } from './follow.service';
import { FollowAccountRequest } from './model/FollowAccountRequest';
import { FollowAccountResponse } from './model/FollowAccountResponse';
import { MyFollowerRequest } from './model/MyFollowerRequest';
import { MyFollowerResponse } from './model/MyFollowerResponse';
import { UnFollowAccountRequest } from './model/UnFollowAccountRequest';
import { UnFollowAccountResponse } from './model/UnFollowAccountResponse';


@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('/api/v2/follow')
@ApiTags('/api/v2/follow')
export class FollowController {
    logger: W3Logger;
    constructor(private readonly service: FollowService,
    ) {
        this.logger = new W3Logger(`FollowController`);
    }

    @Post('/listMyFollows')
    @ApiOperation({ summary: 'list all tags' })
    @ApiOkResponse({ type: MyFollowerResponse })
    async listMyFollows(@Req() req, @Body() param: MyFollowerRequest): Promise<MyFollowerResponse> {

        this.logger.debug(`listMyFollows:${JSON.stringify(param)}`);
        let validateUser: AuthorizedUser = req.user;
        let accountId = validateUser.id;

        return await this.service.listMyFollows(param, accountId);
    }

    @Post('/follow')
    @ApiOperation({ summary: 'follow the account' })
    @ApiOkResponse({ type: FollowAccountResponse })
    async follow(@Req() req, @Body() param: FollowAccountRequest): Promise<FollowAccountResponse> {

        this.logger.debug(`follow:${JSON.stringify(param)}`);
        let validateUser: AuthorizedUser = req.user;
        let accountId = validateUser.id;

        return await this.service.follow(param, accountId);
    }

    @Post('/unfollow')
    @ApiOperation({ summary: 'unfollow the account' })
    @ApiOkResponse({ type: UnFollowAccountResponse })
    async unfollow(@Req() req, @Body() param: UnFollowAccountRequest): Promise<UnFollowAccountResponse> {

        this.logger.debug(`unfollow:${JSON.stringify(param)}`);
        let validateUser: AuthorizedUser = req.user;
        let accountId = validateUser.id;

        return await this.service.unfollow(param, accountId);
    }


}