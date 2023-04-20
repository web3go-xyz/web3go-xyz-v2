import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiOkResponse, ApiBearerAuth } from '@nestjs/swagger';

import { AuthorizedUser } from 'src/base/auth/AuthorizedUser';
import { AllowAnonymous } from 'src/base/auth/decorator/AllowAnonymous';
import { JwtAuthGuard } from 'src/base/auth/decorator/JwtAuthGuard';
import { JWTAuthService } from 'src/base/auth/jwt-auth.service';
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
    constructor(
        private readonly service: FollowService,
        private readonly jwtService: JWTAuthService
    ) {
        this.logger = new W3Logger(`FollowController`);
    }

    @AllowAnonymous()
    @Post('/listFollowing')
    @ApiOperation({ summary: 'list all others you are following, you=>others' })
    @ApiOkResponse({ type: MyFollowerResponse })
    async listFollowing(@Req() req, @Body() param: MyFollowerRequest): Promise<MyFollowerResponse> {

        let accountId = param.account_id;
        if (!accountId) {
            let validateUser: AuthorizedUser = this.jwtService.decodeAuthUserFromHttpRequest(req);
            if (validateUser) {
                accountId = validateUser.id;
            }
        }
        this.logger.debug(`listFollowing:accountId=${accountId},${JSON.stringify(param)}`);

        if (!accountId) {
            throw new Error("accountId required");
        }
        return await this.service.listFollowing(param, accountId);
    }

    @AllowAnonymous()
    @Post('/listFollowed')
    @ApiOperation({ summary: 'list all others you are followed,  others=>you' })
    @ApiOkResponse({ type: MyFollowerResponse })
    async listFollowed(@Req() req, @Body() param: MyFollowerRequest): Promise<MyFollowerResponse> {

        let accountId = param.account_id;
        if (!accountId) {
            let validateUser: AuthorizedUser = this.jwtService.decodeAuthUserFromHttpRequest(req);
            if (validateUser) {
                accountId = validateUser.id;
            }
        }
        this.logger.debug(`listFollowed: accountId=${accountId},${JSON.stringify(param)}`);
        if (!accountId) {
            throw new Error("accountId required");
        }

        return await this.service.listFollowed(param, accountId);
    }


    @Post('/follow')
    @ApiOperation({ summary: 'follow the account' })
    @ApiOkResponse({ type: FollowAccountResponse })
    async follow(@Req() req, @Body() param: FollowAccountRequest): Promise<FollowAccountResponse> {

        this.logger.debug(`follow:${JSON.stringify(param)}`);
        let validateUser: AuthorizedUser = req.user;
        let accountId = validateUser.id;
        if(!accountId || !param.targetAccountId){
            throw new Error("accountId required");           
        }
        if (accountId === param.targetAccountId) {
            throw new Error("you can't follow yourself"); 
        }
        return await this.service.follow(param, accountId);
    }

    @Post('/unfollow')
    @ApiOperation({ summary: 'unfollow the account' })
    @ApiOkResponse({ type: UnFollowAccountResponse })
    async unfollow(@Req() req, @Body() param: UnFollowAccountRequest): Promise<UnFollowAccountResponse> {

        this.logger.debug(`unfollow:${JSON.stringify(param)}`);
        let validateUser: AuthorizedUser = req.user;
        let accountId = validateUser.id;
        if(!accountId){
            throw new Error("accountId required");           
        }
        return await this.service.unfollow(param, accountId);
    }


}