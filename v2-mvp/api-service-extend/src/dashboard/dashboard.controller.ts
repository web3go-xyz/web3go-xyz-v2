import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiOkResponse } from '@nestjs/swagger';
import { ConfigTag } from 'src/base/entity/platform-config/ConfigTag';
import { W3Logger } from 'src/base/log/logger.service';
import { DashboardService } from './dashboard.service';


@Controller('/api/v2/dashboard')
@ApiTags('/api/v2/dashboard')
export class DashboardController {
    logger: W3Logger;
    constructor(private readonly service: DashboardService) {
        this.logger = new W3Logger(`DashboardController`);
    }

    @Post('/listAllTags')
    @ApiOperation({ summary: 'list all tags' })
    @ApiOkResponse({ type: ConfigTag, isArray: true })
    async listAllTags(@Body() request: Object): Promise<ConfigTag[]> {
        return await this.service.listAllTags(request);
    }

    @Post('/list')
    @ApiOperation({ summary: 'list dashboard' })
    @ApiOkResponse({ type: Object })
    async list(@Body() request: Object): Promise<any> {

        this.logger.debug(`list:${JSON.stringify(request)}`);
        return await this.service.list(request);
    }
}