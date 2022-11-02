import { Controller, Get, Query } from '@nestjs/common';
import { ApiOperation, ApiOkResponse, ApiTags, ApiParam } from '@nestjs/swagger';
import { W3Logger } from 'src/base/log/logger.service';
import { DebugService } from './debug.service';

@Controller('/api/v2/debug')
@ApiTags('/api/v2/debug')
export class DebugController {
    logger: W3Logger;
    constructor(private readonly debugService: DebugService) {
        this.logger = new W3Logger(`DebugController`);
    }

    @Get('/debug_verifyCode')
    @ApiOperation({ summary: 'DEBUG get verify code' })
    @ApiOkResponse({ type: Object })
    async DEBUG_verifyCode(): Promise<any> {
        return await this.debugService.DEBUG_verifyCode();
    }


    @Get('/debug_syncDashboardFromMB')
    @ApiOperation({ summary: 'DEBUG sync dashboard from metabase' })
    @ApiParam({ required: false, name: 'dashboard_id', type: Number })
    @ApiOkResponse({ type: Object })
    async debug_syncDashboardFromMB(@Query('dashboard_id') dashboard_id: number): Promise<any> {
        return await this.debugService.debug_syncDashboardFromMB(dashboard_id || -1);
    }
}
