import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiOkResponse, ApiBearerAuth } from '@nestjs/swagger';

import { AuthorizedUser } from 'src/base/auth/AuthorizedUser';
import { AllowAnonymous } from 'src/base/auth/decorator/AllowAnonymous';
import { JwtAuthGuard } from 'src/base/auth/decorator/JwtAuthGuard';
import { W3Logger } from 'src/base/log/logger.service'; 
import { QueryFavoriteDashboardListRequest } from 'src/dashboard/model/QueryFavoriteDashboardListRequest';
import { QueryFavoriteDashboardListResponse } from 'src/dashboard/model/QueryFavoriteDashboardListResponse';
import { FavoriteService } from './favorite.service';
import { Log4FavoriteDashboardRequest } from './model/Log4FavoriteDashboardRequest';
import { Log4FavoriteDashboardResponse } from './model/Log4FavoriteDashboardResponse';


@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('/api/v2/favorite')
@ApiTags('/api/v2/favorite')
export class FavoriteController {
    logger: W3Logger;
    constructor(private readonly service: FavoriteService,) {
        this.logger = new W3Logger(`FavoriteController`);
    }

    @Post('/listMyFavorites')
    @ApiOperation({ summary: 'list of my favorite dashboards ' })
    @ApiOkResponse({ type: QueryFavoriteDashboardListResponse })
    async listMyFavorites(@Req() req,
        @Body() param: QueryFavoriteDashboardListRequest): Promise<QueryFavoriteDashboardListResponse> {
        let validateUser: AuthorizedUser = req.user;
        param.accountId = validateUser.id;
        this.logger.debug(`listMyFavorites:${JSON.stringify(param)}`);
        return await this.service.listFavorites(param);
    }

    @AllowAnonymous()
    @Post('/listFavorites')
    @ApiOperation({ summary: 'list of someone\'s favorite dashboards ' })
    @ApiOkResponse({ type: QueryFavoriteDashboardListResponse })
    async listFavorites(@Req() req,
        @Body() param: QueryFavoriteDashboardListRequest): Promise<QueryFavoriteDashboardListResponse> {       
        this.logger.debug(`listFavorites:${JSON.stringify(param)}`);
        return await this.service.listFavorites(param);
    }

    @Post('/logFavorite')
    @ApiOperation({ summary: 'create a log when the specified dashboard is marked as favorited by user' })
    @ApiOkResponse({ type: Log4FavoriteDashboardResponse })
    async logFavorite(@Req() req,
        @Body() param: Log4FavoriteDashboardRequest): Promise<Log4FavoriteDashboardResponse> {
        let validateUser: AuthorizedUser = req.user;
        param.accountId = validateUser.id;

        this.logger.debug(`logFavorite:${JSON.stringify(param)}`);
        return await this.service.logFavorite(param);
    }


}