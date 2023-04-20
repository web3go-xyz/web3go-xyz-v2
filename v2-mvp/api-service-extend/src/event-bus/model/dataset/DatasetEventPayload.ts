import { DatasetEventTopic } from "./DatasetEventTopic";

export class DatasetEventPayload {

    topic: DatasetEventTopic;
    data?: {
        accountId?: string,
        dataSetId?: number,
        extra?: any
    };
}