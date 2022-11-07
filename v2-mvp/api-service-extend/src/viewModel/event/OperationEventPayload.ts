import { OperationEventTopic } from "./OperationEventTopic";

export class OperationEventPayload {

    topic: OperationEventTopic;
    data?: {
        accountId?: string,
        dashboardId?: number,
        extra?: any
    };
}