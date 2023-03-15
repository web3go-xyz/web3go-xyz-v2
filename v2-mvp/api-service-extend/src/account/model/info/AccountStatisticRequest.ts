

import { ApiProperty } from "@nestjs/swagger";

export class AccountStatisticRequest {

    @ApiProperty()
    accountIds: string[];

} 