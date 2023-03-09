import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiOkResponse, ApiBearerAuth } from '@nestjs/swagger';

import { AuthorizedUser } from 'src/base/auth/AuthorizedUser';
import { AllowAnonymous } from 'src/base/auth/decorator/AllowAnonymous';
import { JwtAuthGuard } from 'src/base/auth/decorator/JwtAuthGuard';
import { W3Logger } from 'src/base/log/logger.service'; 
import { QueryFavoriteDashboardListRequest } from 'src/dashboard/model/QueryFavoriteDashboardListRequest';
import { FavoriteService } from './favorite.service';
import { Log4FavoriteRequest } from './model/Log4FavoriteRequest';
import { Log4FavoriteResponse } from './model/Log4FavoriteResponse';
import { QueryFavoriteDatasetListResponse } from './model/QueryFavoriteDatasetListResponse';


@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('/api/v2/dataset/favorite')
@ApiTags('/api/v2/dataset/')
export class FavoriteController {
    logger: W3Logger;
    constructor(private readonly service: FavoriteService,) {
        this.logger = new W3Logger(`FavoriteController`);
    }

    @Post('/listMyFavorites')
    @ApiOperation({ summary: 'list of my favorite dashboards ' })
    @ApiOkResponse({ type: QueryFavoriteDatasetListResponse })
    async listMyFavorites(@Req() req,
        @Body() param: QueryFavoriteDashboardListRequest): Promise<QueryFavoriteDatasetListResponse> {
        let validateUser: AuthorizedUser = req.user;
        param.accountId = validateUser.id;
        this.logger.debug(`listMyFavorites:${JSON.stringify(param)}`);
        return await this.service.listFavorites(param);
    }

    @AllowAnonymous()
    @Post('/listFavorites')
    @ApiOperation({ summary: 'list of someone\'s favorite dashboards ' })
    @ApiOkResponse({ type: QueryFavoriteDatasetListResponse })
    async listFavorites(@Req() req,
        @Body() param: QueryFavoriteDashboardListRequest): Promise<QueryFavoriteDatasetListResponse> {       
        this.logger.debug(`listFavorites:${JSON.stringify(param)}`);
        return await this.service.listFavorites(param);
    }

    @Post('/logFavorite')
    @ApiOperation({ summary: 'create a log when the specified dashboard is marked as favorited by user' })
    @ApiOkResponse({ type: Log4FavoriteResponse })
    async logFavorite(@Req() req,
        @Body() param: Log4FavoriteRequest): Promise<Log4FavoriteResponse> {
        let validateUser: AuthorizedUser = req.user;
        param.accountId = validateUser.id;

        this.logger.debug(`logFavorite:${JSON.stringify(param)}`);
        return await this.service.logFavorite(param);
    }


}