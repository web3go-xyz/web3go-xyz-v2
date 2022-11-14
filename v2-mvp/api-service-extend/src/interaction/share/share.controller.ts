import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiOkResponse, ApiBearerAuth } from '@nestjs/swagger';

import { AuthorizedUser } from 'src/base/auth/AuthorizedUser';
import { AllowAnonymous } from 'src/base/auth/decorator/AllowAnonymous';
import { JwtAuthGuard } from 'src/base/auth/decorator/JwtAuthGuard';
import { JWTAuthService } from 'src/base/auth/jwt-auth.service';
import { W3Logger } from 'src/base/log/logger.service';
import { GenerateShareLink4DashboardRequest } from './model/GenerateShareLink4DashboardRequest';
import { GenerateShareLink4DashboardResponse } from './model/GenerateShareLink4DashboardResponse';
import { Log4ShareDashboardRequest } from './model/Log4ShareDashboardRequest';
import { Log4ShareDashboardResponse } from './model/Log4ShareDashboardResponse';

import { ShareService } from './share.service';


@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('/api/v2/share')
@ApiTags('/api/v2/share')
export class ShareController {
    logger: W3Logger;
    constructor(private readonly service: ShareService,
        private readonly jwtService: JWTAuthService) {
        this.logger = new W3Logger(`ShareController`);
    }

    @AllowAnonymous()
    @Post('/logShare')
    @ApiOperation({ summary: 'create a log when share the specified dashboard' })
    @ApiOkResponse({ type: Log4ShareDashboardResponse })
    async logShare(@Req() req,
        @Body() param: Log4ShareDashboardRequest): Promise<Log4ShareDashboardResponse> {

        let accountId = '';
        let validateUser: AuthorizedUser = this.jwtService.decodeAuthUserFromHttpRequest(req);
        if (validateUser) {
            accountId = validateUser.id;
        }

        this.logger.debug(`logShare:${JSON.stringify(param)}, accountId:${accountId}`);

        return await this.service.logShare(param, accountId || '');
    }

    @AllowAnonymous()
    @Post('/generateDashboardShareLink')
    @ApiOperation({ summary: 'generate share link when share the specified dashboard' })
    @ApiOkResponse({ type: GenerateShareLink4DashboardResponse })
    async generateDashboardShareLink(@Req() req,
        @Body() param: GenerateShareLink4DashboardRequest): Promise<GenerateShareLink4DashboardResponse> {

        let accountId = '';
        let validateUser: AuthorizedUser = this.jwtService.decodeAuthUserFromHttpRequest(req);
        if (validateUser) {
            accountId = validateUser.id;
        }

        this.logger.debug(`generateDashboardShareLink:${JSON.stringify(param)}, accountId:${accountId}`);

        return await this.service.generateDashboardShareLink(param, accountId || '');
    }



}