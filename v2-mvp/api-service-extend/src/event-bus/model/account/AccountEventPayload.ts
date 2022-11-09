import { AccountEventTopic } from "./AccountEventTopic";

export class AccountEventPayload {

    topic: AccountEventTopic;
    data?: {
        accountId?: string,
        targetAccountId?: string,

        extra?: any
    };
}