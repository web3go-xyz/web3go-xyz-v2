
import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiOkResponse, ApiBearerAuth } from '@nestjs/swagger';

import { AllowAnonymous } from 'src/base/auth/decorator/AllowAnonymous';
import { JwtAuthGuard } from 'src/base/auth/decorator/JwtAuthGuard';
import { W3Logger } from 'src/base/log/logger.service';

import { CreatorService } from './creator.service';
import { QueryTopCreatorRequest } from './model/QueryTopCreatorRequest';
import { QueryTopCreatorResponse } from './model/QueryTopCreatorResponse';


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
    @Post('/listAllCreators')
    @ApiOperation({ summary: 'list all creators of dashboards' })
    @ApiOkResponse({ type: String, isArray: true })
    async listAllCreators(@Body() param: Object): Promise<String[]> {
        return await this.service.listAllCreators(param);  //TODO  statistics
    }

    @AllowAnonymous()
    @Post('/topCreators')
    @ApiOperation({ summary: 'list top creators of dashboards' })
    @ApiOkResponse({ type: QueryTopCreatorResponse, isArray: false })
    async topCreators(@Body() param: QueryTopCreatorRequest): Promise<QueryTopCreatorResponse> {
        return await this.service.listTopCreators(param);  //TODO statistics
    }
}