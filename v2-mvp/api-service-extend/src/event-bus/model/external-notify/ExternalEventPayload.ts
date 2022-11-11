import { ApiProperty } from "@nestjs/swagger";
import { ExternalEventTopic } from "./ExternalEventTopic";

export class ExternalEventPayload {

    @ApiProperty({
        type: typeof (ExternalEventTopic), default: ExternalEventTopic.DashboardChanged,
        description: 'refer to ExternalEventTopic'
    })
    topic: ExternalEventTopic;
    @ApiProperty({ description: 'dashboard_id when topic=ExternalEventTopic.DashboardChanged', default: 0 })
    data: any;

}