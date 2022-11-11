import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { ApiOperation, ApiOkResponse, ApiTags, ApiParam } from '@nestjs/swagger';
import { W3Logger } from 'src/base/log/logger.service';
import { EventService } from './event.service';
import { ExternalEventPayload } from './model/external-notify/ExternalEventPayload';

@Controller('/api/v2/event')
@ApiTags('/api/v2/event')
export class EventController {
    logger: W3Logger;
    constructor(private readonly eventService: EventService) {
        this.logger = new W3Logger(`EventController`);
    }


    @Post('/externalEvent')
    @ApiOperation({ summary: 'some events happened from external system' })
    @ApiOkResponse({ type: Object })
    async externalEventFired(@Body() param: ExternalEventPayload): Promise<any> {
        this.logger.log(`externalEventFired:${JSON.stringify(param)}`);
        return await this.eventService.externalEventFired(param);
    }
}
