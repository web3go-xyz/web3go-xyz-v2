import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiOkResponse, ApiBearerAuth } from '@nestjs/swagger';

import { AuthorizedUser } from 'src/base/auth/AuthorizedUser';
import { JwtAuthGuard } from 'src/base/auth/decorator/JwtAuthGuard';
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
    constructor(private readonly service: ShareService,) {
        this.logger = new W3Logger(`ShareController`);
    }
 

    @Post('/logShare')
    @ApiOperation({ summary: 'create a log when share the specified dashboard' })
    @ApiOkResponse({ type: Log4ShareDashboardResponse })
    async logShare(@Req() req,
        @Body() param: Log4ShareDashboardRequest): Promise<Log4ShareDashboardResponse> {
        this.logger.debug(`logShare:${JSON.stringify(param)}`);
        let validateUser: AuthorizedUser = req.user;
        let accountId = validateUser.id;
        return await this.service.logShare(param, accountId || '');
    }

    @Post('/generateDashboardShareLink')
    @ApiOperation({ summary: 'generate share link when share the specified dashboard' })
    @ApiOkResponse({ type: GenerateShareLink4DashboardResponse })
    async generateDashboardShareLink(@Req() req,
        @Body() param: GenerateShareLink4DashboardRequest): Promise<GenerateShareLink4DashboardResponse> {
        this.logger.debug(`generateDashboardShareLink:${JSON.stringify(param)}`);
        let validateUser: AuthorizedUser = req.user;
        let accountId = validateUser.id;
        return await this.service.generateDashboardShareLink(param, accountId || '');
    }



}