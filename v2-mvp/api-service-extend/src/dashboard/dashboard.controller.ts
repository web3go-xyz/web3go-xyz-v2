import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiOkResponse, ApiBearerAuth } from '@nestjs/swagger';

import { AllowAnonymous } from 'src/base/auth/decorator/AllowAnonymous';
import { JwtAuthGuard } from 'src/base/auth/decorator/JwtAuthGuard';
import { W3Logger } from 'src/base/log/logger.service';
import { QueryDashboardDetailRequest } from 'src/dashboard/model/QueryDashboardDetailRequest';
import { QueryDashboardDetailResponse } from 'src/dashboard/model/QueryDashboardDetailResponse';
import { QueryDashboardListRequest } from 'src/dashboard/model/QueryDashboardListRequest';
import { QueryDashboardListResponse } from 'src/dashboard/model/QueryDashboardListResponse';
import { DashboardService } from './dashboard.service';
import { QueryRelatedDashboardsRequest } from './model/QueryRelatedDashboardsRequest';



@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('/api/v2/dashboard')
@ApiTags('/api/v2/dashboard')
export class DashboardController {
    logger: W3Logger;
    constructor(private readonly service: DashboardService) {
        this.logger = new W3Logger(`DashboardController`);
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


    @AllowAnonymous()
    @Post('/refresh')
    @ApiOperation({ summary: 'refresh the specified dashboards' })
    @ApiOkResponse({ type: Object })
    async refresh(@Body() param: QueryDashboardDetailRequest): Promise<any> {

        this.logger.debug(`refresh:${JSON.stringify(param)}`);
        return await this.service.refresh(param);
    }

    @AllowAnonymous()
    @Post('/searchRelatedDashboards')
    @ApiOperation({ summary: 'search related dashboards which has similar tags' })
    @ApiOkResponse({ type: QueryDashboardListResponse })
    async searchRelatedDashboards(@Body() param: QueryRelatedDashboardsRequest): Promise<QueryDashboardListResponse> {

        this.logger.debug(`searchRelatedDashboards:${JSON.stringify(param)}`);
        return await this.service.searchRelatedDashboards(param);
    }
}