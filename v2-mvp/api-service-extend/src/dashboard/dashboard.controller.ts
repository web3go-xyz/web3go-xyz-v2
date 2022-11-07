import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiOkResponse, ApiBearerAuth } from '@nestjs/swagger';

import { AuthorizedUser } from 'src/base/auth/AuthorizedUser';
import { AllowAnonymous } from 'src/base/auth/decorator/AllowAnonymous';
import { JwtAuthGuard } from 'src/base/auth/decorator/JwtAuthGuard';
import { JWTAuthService } from 'src/base/auth/jwt-auth.service';
import { Request } from 'express';
import { ConfigTag } from 'src/base/entity/platform-config/ConfigTag';
import { W3Logger } from 'src/base/log/logger.service';
import { Log4FavoriteDashboardRequest } from 'src/viewModel/dashboard/interact-log/Log4FavoriteDashboardRequest';
import { Log4FavoriteDashboardResponse } from 'src/viewModel/dashboard/interact-log/Log4FavoriteDashboardResponse';
import { Log4ViewDashboardRequest } from 'src/viewModel/dashboard/interact-log/Log4ViewDashboardRequest';
import { Log4ViewDashboardResponse } from 'src/viewModel/dashboard/interact-log/Log4ViewDashboardResponse';
import { QueryDashboardDetailRequest } from 'src/viewModel/dashboard/QueryDashboardDetailRequest';
import { QueryDashboardDetailResponse } from 'src/viewModel/dashboard/QueryDashboardDetailResponse';
import { QueryDashboardListRequest } from 'src/viewModel/dashboard/QueryDashboardListRequest';
import { QueryDashboardListResponse } from 'src/viewModel/dashboard/QueryDashboardListResponse';
import { QueryMyFavoriteDashboardListRequest } from 'src/viewModel/dashboard/QueryMyFavoriteDashboardListRequest';
import { QueryMyFavoriteDashboardListResponse } from 'src/viewModel/dashboard/QueryMyFavoriteDashboardListResponse';
import { DashboardService } from './dashboard.service';


@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('/api/v2/dashboard')
@ApiTags('/api/v2/dashboard')
export class DashboardController {
    logger: W3Logger;
    constructor(private readonly service: DashboardService,
        private readonly jwtService: JWTAuthService) {
        this.logger = new W3Logger(`DashboardController`);
    }

    @AllowAnonymous()
    @Post('/listAllTags')
    @ApiOperation({ summary: 'list all tags' })
    @ApiOkResponse({ type: ConfigTag, isArray: true })
    async listAllTags(@Body() param: Object): Promise<ConfigTag[]> {
        return await this.service.listAllTags(param);
    }

    @AllowAnonymous()
    @Post('/list')
    @ApiOperation({ summary: 'list dashboard' })
    @ApiOkResponse({ type: QueryDashboardListResponse })
    async list(@Body() param: QueryDashboardListRequest): Promise<QueryDashboardListResponse> {

        this.logger.debug(`list:${JSON.stringify(param)}`);
        return await this.service.list(param);
    }

    @AllowAnonymous()
    @Post('/detail')
    @ApiOperation({ summary: 'get detail info of the specified dashboard' })
    @ApiOkResponse({ type: QueryDashboardDetailResponse })
    async detail(@Body() param: QueryDashboardDetailRequest): Promise<QueryDashboardDetailResponse> {

        this.logger.debug(`detail:${JSON.stringify(param)}`);
        return await this.service.detail(param);
    }

    @Post('/listMyFavorites')
    @ApiOperation({ summary: 'list of my favorite ashboards ' })
    @ApiOkResponse({ type: QueryMyFavoriteDashboardListResponse })
    async listMyFavorites(@Req() request,
        @Body() param: QueryMyFavoriteDashboardListRequest): Promise<QueryMyFavoriteDashboardListResponse> {
        let validateUser: AuthorizedUser = request.user;
        param.accountId = validateUser.id;
        this.logger.debug(`listMyFavorites:${JSON.stringify(param)}`);
        return await this.service.listMyFavorites(param);
    }

    @Post('/logFavorite')
    @ApiOperation({ summary: 'create a log when the specified dashboard is marked as favorited by user' })
    @ApiOkResponse({ type: Log4FavoriteDashboardResponse })
    async logFavorite(@Req() request,
        @Body() param: Log4FavoriteDashboardRequest): Promise<Log4FavoriteDashboardResponse> {
        let validateUser: AuthorizedUser = request.user;
        param.accountId = validateUser.id;

        this.logger.debug(`logFavorite:${JSON.stringify(param)}`);
        return await this.service.logFavorite(param);
    }

    @AllowAnonymous()
    @Post('/logView')
    @ApiOperation({ summary: 'create a log when view the specified dashboard' })
    @ApiOkResponse({ type: Log4ViewDashboardResponse })
    async logView(@Req() request: Request,
        @Body() param: Log4ViewDashboardRequest): Promise<Log4ViewDashboardResponse> {

        let accountId = '';
        let validateUser: AuthorizedUser = this.jwtService.decodeAuthUserFromHttpRequest(request);
        if (validateUser) {
            accountId = validateUser.id;
        }
        this.logger.debug(`logView:accountId=${accountId},${JSON.stringify(param)}`);
        return await this.service.logView(param, accountId || '');
    }

    // @Post('/logShare')
    // @ApiOperation({ summary: 'create a log when share the specified dashboard' })
    // @ApiOkResponse({ type: Log4ShareDashboardResponse })
    // async logShare(@Body() request: Log4ShareDashboardRequest): Promise<Log4ShareDashboardResponse> {
    //     this.logger.debug(`logShare:${JSON.stringify(request)}`);
    //     return await this.service.logShare(request);
    // }

    // @Post('/logFork')
    // @ApiOperation({ summary: 'create a log when fork the specified dashboard' })
    // @ApiOkResponse({ type: Log4ForkDashboardResponse })
    // async logFork(@Body() request: Log4ForkDashboardRequest): Promise<Log4ForkDashboardResponse> {
    //     this.logger.debug(`logFork:${JSON.stringify(request)}`);
    //     return await this.service.logFork(request);
    // }


    // @Post('/markTag')
    // @ApiOperation({ summary: 'mark tag for specified dashboard' })
    // @ApiOkResponse({ type: MarkTag4DashboardResponse })
    // async markTag(@Body() request: MarkTag4DashboardRequest): Promise<MarkTag4DashboardResponse> {
    //     this.logger.debug(`markTag:${JSON.stringify(request)}`);
    //     return await this.service.markTag(request);
    // }

    // @Post('/removeTag')
    // @ApiOperation({ summary: 'remove tag for specified dashboard' })
    // @ApiOkResponse({ type: RemoveTag4DashboardResponse })
    // async removeTag(@Body() request: RemoveTag4DashboardRequest): Promise<RemoveTag4DashboardResponse> {
    //     this.logger.debug(`removeTag:${JSON.stringify(request)}`);
    //     return await this.service.removeTag(request);
    // }

}