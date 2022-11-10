import { DashboardEventTopic } from "./DashboardEventTopic";

export class DashboardEventPayload {

    topic: DashboardEventTopic;
    data?: {
        accountId?: string,
        dashboardId?: number,
        extra?: any
    };
}