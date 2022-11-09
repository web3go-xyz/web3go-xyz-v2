import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiOkResponse, ApiBearerAuth } from '@nestjs/swagger';

import { AuthorizedUser } from 'src/base/auth/AuthorizedUser';
import { JwtAuthGuard } from 'src/base/auth/decorator/JwtAuthGuard';
import { W3Logger } from 'src/base/log/logger.service';
import { QueryMyFavoriteDashboardListRequest } from 'src/dashboard/model/QueryMyFavoriteDashboardListRequest';
import { QueryMyFavoriteDashboardListResponse } from 'src/dashboard/model/QueryMyFavoriteDashboardListResponse';
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
    @ApiOperation({ summary: 'list of my favorite ashboards ' })
    @ApiOkResponse({ type: QueryMyFavoriteDashboardListResponse })
    async listMyFavorites(@Req() req,
        @Body() param: QueryMyFavoriteDashboardListRequest): Promise<QueryMyFavoriteDashboardListResponse> {
        let validateUser: AuthorizedUser = req.user;
        param.accountId = validateUser.id;
        this.logger.debug(`listMyFavorites:${JSON.stringify(param)}`);
        return await this.service.listMyFavorites(param);
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