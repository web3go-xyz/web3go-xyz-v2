import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiOkResponse } from '@nestjs/swagger';
import { W3Logger } from 'src/base/log/logger.service';
import { DashboardService } from './dashboard.service';


@Controller('/api/v2/dashboard')
@ApiTags('/api/v2/dashboard')
export class DashboardController {
    logger: W3Logger;
    constructor(private readonly service: DashboardService) {
        this.logger = new W3Logger(`DashboardController`);
    }

    @Post('/list')
    @ApiOperation({ summary: 'list dashboard' })
    @ApiOkResponse({ type: Object })
    async list(@Body() request: Object): Promise<any> {

        this.logger.debug(`list:${JSON.stringify(request)}`);
        return await this.service.list(request);
    }
}