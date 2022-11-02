import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiOkResponse } from '@nestjs/swagger';
import { ConfigTag } from 'src/base/entity/platform-config/ConfigTag';
import { W3Logger } from 'src/base/log/logger.service';
import { QueryDashboardListRequest } from 'src/viewModel/dashboard/QueryDashboardListRequest';
import { QueryDashboardListResponse } from 'src/viewModel/dashboard/QueryDashboardListResponse';
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
    @ApiOkResponse({ type: QueryDashboardListResponse })
    async list(@Body() request: QueryDashboardListRequest): Promise<QueryDashboardListResponse> {

        this.logger.debug(`list:${JSON.stringify(request)}`);
        return await this.service.list(request);
    }


    // @Post('/markTag')
    // @ApiOperation({ summary: 'mark tag for specified dashboard' })
    // @ApiOkResponse({ type: MarkTag4DashboardResponse })
    // async markTag(@Body() request: MarkTag4DashboardRequest): Promise<MarkTag4DashboardResponse> {
    //     this.logger.debug(`markTag:${JSON.stringify(request)}`);
    //     return await this.service.markTag(request);
    // }

    // @Post('/removeTag')
    // @ApiOperation({ summary: 'remove tag for specified dashboard' })
    // @ApiOkResponse({ type: RemoveTag4DashboardResponse })
    // async removeTag(@Body() request: RemoveTag4DashboardRequest): Promise<RemoveTag4DashboardResponse> {
    //     this.logger.debug(`removeTag:${JSON.stringify(request)}`);
    //     return await this.service.removeTag(request);
    // }
}