
import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiOkResponse, ApiBearerAuth } from '@nestjs/swagger';

import { AllowAnonymous } from 'src/base/auth/decorator/AllowAnonymous';
import { JwtAuthGuard } from 'src/base/auth/decorator/JwtAuthGuard';
import { W3Logger } from 'src/base/log/logger.service';

import { CreatorService } from './creator.service';
import { QueryTopCreatorRequest } from './model/QueryTopCreatorRequest';
import { CreatorStatistic, QueryTopCreatorResponse } from './model/QueryTopCreatorResponse';


@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('/api/v2/creator')
@ApiTags('/api/v2/creator')
export class CreatorController {
    logger: W3Logger;
    constructor(private readonly service: CreatorService,
    ) {
        this.logger = new W3Logger(`CreatorController`);
    }


    @AllowAnonymous()
    @Post('/listCreators')
    @ApiOperation({ summary: 'list creators of dashboards' })
    @ApiOkResponse({ type: QueryTopCreatorResponse, })
    async listCreators(@Body() param: QueryTopCreatorRequest): Promise<QueryTopCreatorResponse> {
        return await this.service.listCreators(param);
    }
}