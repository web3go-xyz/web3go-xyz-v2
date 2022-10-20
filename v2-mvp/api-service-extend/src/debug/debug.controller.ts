import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiOkResponse, ApiTags } from '@nestjs/swagger';
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
}
