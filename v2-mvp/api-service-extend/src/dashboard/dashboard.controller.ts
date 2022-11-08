import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiOkResponse, ApiBearerAuth } from '@nestjs/swagger';

import { AuthorizedUser } from 'src/base/auth/AuthorizedUser';
import { AllowAnonymous } from 'src/base/auth/decorator/AllowAnonymous';
import { JwtAuthGuard } from 'src/base/auth/decorator/JwtAuthGuard';
import { JWTAuthService } from 'src/base/auth/jwt-auth.service';
import { ConfigTag } from 'src/base/entity/platform-config/ConfigTag';
import { W3Logger } from 'src/base/log/logger.service';
import { Log4ViewDashboardRequest } from 'src/dashboard/model/view/Log4ViewDashboardRequest';
import { Log4ViewDashboardResponse } from 'src/dashboard/model/view/Log4ViewDashboardResponse';
import { QueryDashboardDetailRequest } from 'src/dashboard/model/QueryDashboardDetailRequest';
import { QueryDashboardDetailResponse } from 'src/dashboard/model/QueryDashboardDetailResponse';
import { QueryDashboardListRequest } from 'src/dashboard/model/QueryDashboardListRequest';
import { QueryDashboardListResponse } from 'src/dashboard/model/QueryDashboardListResponse';
import { QueryMyFavoriteDashboardListRequest } from 'src/dashboard/model/QueryMyFavoriteDashboardListRequest';
import { QueryMyFavoriteDashboardListResponse } from 'src/dashboard/model/QueryMyFavoriteDashboardListResponse';
import { DashboardService } from './dashboard.service';
import { MarkTag4DashboardRequest } from 'src/dashboard/model/tag/MarkTag4DashboardRequest';
import { MarkTag4DashboardResponse } from 'src/dashboard/model/tag/MarkTag4DashboardResponse';
import { RemoveTag4DashboardRequest } from 'src/dashboard/model/tag/RemoveTag4DashboardRequest';
import { RemoveTag4DashboardResponse } from 'src/dashboard/model/tag/RemoveTag4DashboardResponse';
import { Log4ForkDashboardRequest } from 'src/dashboard/model/fork/Log4ForkDashboardRequest';
import { Log4ForkDashboardResponse } from 'src/dashboard/model/fork/Log4ForkDashboardResponse';
import { DashboardOperationService } from './dashboard-operation.service';
import { Log4FavoriteDashboardRequest } from 'src/dashboard/model/favorite/Log4FavoriteDashboardRequest';
import { Log4FavoriteDashboardResponse } from 'src/dashboard/model/favorite/Log4FavoriteDashboardResponse';

import { GenerateShareLink4DashboardRequest } from 'src/share/model/GenerateShareLink4DashboardRequest';
import { GenerateShareLink4DashboardResponse } from 'src/share/model/GenerateShareLink4DashboardResponse';
import { Log4ShareDashboardRequest } from 'src/share/model/Log4ShareDashboardRequest';
import { Log4ShareDashboardResponse } from 'src/share/model/Log4ShareDashboardResponse';


@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('/api/v2/dashboard')
@ApiTags('/api/v2/dashboard')
export class DashboardController {
    logger: W3Logger;
    constructor(private readonly service: DashboardService,
        private readonly operationService: DashboardOperationService,
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
        return await this.operationService.logFavorite(param);
    }

    @AllowAnonymous()
    @Post('/logView')
    @ApiOperation({ summary: 'create a log when view the specified dashboard' })
    @ApiOkResponse({ type: Log4ViewDashboardResponse })
    async logView(@Req() req,
        @Body() param: Log4ViewDashboardRequest): Promise<Log4ViewDashboardResponse> {

        let accountId = '';
        let validateUser: AuthorizedUser = this.jwtService.decodeAuthUserFromHttpRequest(req);
        if (validateUser) {
            accountId = validateUser.id;
        }
        this.logger.debug(`logView:accountId=${accountId},${JSON.stringify(param)}`);
        return await this.operationService.logView(param, accountId || '');
    }

    @Post('/logShare')
    @ApiOperation({ summary: 'create a log when share the specified dashboard' })
    @ApiOkResponse({ type: Log4ShareDashboardResponse })
    async logShare(@Req() req,
        @Body() param: Log4ShareDashboardRequest): Promise<Log4ShareDashboardResponse> {
        this.logger.debug(`logShare:${JSON.stringify(param)}`);
        let validateUser: AuthorizedUser = req.user;
        let accountId = validateUser.id;
        return await this.operationService.logShare(param, accountId || '');
    }

    @Post('/generateDashboardShareLink')
    @ApiOperation({ summary: 'generate share link when share the specified dashboard' })
    @ApiOkResponse({ type: GenerateShareLink4DashboardResponse })
    async generateDashboardShareLink(@Req() req,
        @Body() param: GenerateShareLink4DashboardRequest): Promise<GenerateShareLink4DashboardResponse> {
        this.logger.debug(`generateDashboardShareLink:${JSON.stringify(param)}`);
        let validateUser: AuthorizedUser = req.user;
        let accountId = validateUser.id;
        return await this.operationService.generateDashboardShareLink(param, accountId || '');
    }

    @Post('/logFork')
    @ApiOperation({ summary: 'create a log when fork the specified dashboard' })
    @ApiOkResponse({ type: Log4ForkDashboardResponse })
    async logFork(@Req() req,
        @Body() param: Log4ForkDashboardRequest): Promise<Log4ForkDashboardResponse> {
        this.logger.debug(`logFork:${JSON.stringify(param)}`);
        let validateUser: AuthorizedUser = req.user;
        let accountId = validateUser.id;
        return await this.operationService.logFork(param, accountId || '');
    }


    @Post('/markTags')
    @ApiOperation({ summary: 'mark tag for specified dashboard' })
    @ApiOkResponse({ type: MarkTag4DashboardResponse })
    async markTags(@Req() req, @Body() param: MarkTag4DashboardRequest): Promise<MarkTag4DashboardResponse> {

        this.logger.debug(`markTags:${JSON.stringify(param)}`);
        let validateUser: AuthorizedUser = req.user;
        let accountId = validateUser.id;

        return await this.operationService.markTags(param, accountId);
    }

    @Post('/removeTags')
    @ApiOperation({ summary: 'remove tag for specified dashboard' })
    @ApiOkResponse({ type: RemoveTag4DashboardResponse })
    async removeTags(@Req() req, @Body() param: RemoveTag4DashboardRequest): Promise<RemoveTag4DashboardResponse> {

        this.logger.debug(`removeTags:${JSON.stringify(param)}`);
        let validateUser: AuthorizedUser = req.user;
        let accountId = validateUser.id;

        return await this.operationService.removeTags(param, accountId);
    }

}