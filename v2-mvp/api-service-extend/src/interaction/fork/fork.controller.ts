import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiOkResponse, ApiBearerAuth } from '@nestjs/swagger';

import { AuthorizedUser } from 'src/base/auth/AuthorizedUser';
import { JwtAuthGuard } from 'src/base/auth/decorator/JwtAuthGuard';
import { W3Logger } from 'src/base/log/logger.service';
import { ForkService } from './fork.service';
import { Log4ForkDashboardRequest } from './model/fork/Log4ForkDashboardRequest';
import { Log4ForkDashboardResponse } from './model/fork/Log4ForkDashboardResponse';


@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('/api/v2/fork')
@ApiTags('/api/v2/fork')
export class ForkController {
    logger: W3Logger;
    constructor(private readonly service: ForkService,) {
        this.logger = new W3Logger(`ForkController`);
    }


    @Post('/logFork')
    @ApiOperation({ summary: 'create a log when fork the specified dashboard' })
    @ApiOkResponse({ type: Log4ForkDashboardResponse })
    async logFork(@Req() req,
        @Body() param: Log4ForkDashboardRequest): Promise<Log4ForkDashboardResponse> {
        this.logger.debug(`logFork:${JSON.stringify(param)}`);
        let validateUser: AuthorizedUser = req.user;
        let accountId = validateUser.id;
        return await this.service.logFork(param, accountId || '');
    }



}