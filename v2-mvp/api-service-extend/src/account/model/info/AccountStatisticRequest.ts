

import { ApiProperty } from "@nestjs/swagger";

export class AccountStatisticRequest {

    @ApiProperty()
    accountIds: string[];
    
    @ApiProperty({
        default: 'dashboard',
        description: 'dashboard or dataset'
    })
    type: string;
} 