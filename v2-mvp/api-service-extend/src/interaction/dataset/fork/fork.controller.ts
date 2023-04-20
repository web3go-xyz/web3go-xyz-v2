import { Body, Controller, Param, Post, Req, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiOkResponse, ApiBearerAuth } from '@nestjs/swagger';

import { JwtAuthGuard } from 'src/base/auth/decorator/JwtAuthGuard';
import { W3Logger } from 'src/base/log/logger.service';
import { ForkService } from './fork.service';
import { ForkDatasetResponse } from './model/ForkDatasetResponse';


@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('/api/v2/dataset/fork')
@ApiTags('/api/v2/dataset/')
export class ForkController {
    logger: W3Logger;
    constructor(private readonly service: ForkService,) {
        this.logger = new W3Logger(`ForkController`);
    }

    @Post(':id')
    @ApiOperation({ summary: 'create a copy of the specified question. It includes the question only.' })
    @ApiOkResponse({ type: ForkDatasetResponse })
    doFork(@Req() req, @Param() params): Promise<ForkDatasetResponse> {
        return  this.service.doFork(params.id, req.user.id, req.user.email);
    }
}