import { ApiProperty } from "@nestjs/swagger";

export class SearchAccountInfoRequest {

    @ApiProperty({ required: true })
    accountIds: string[];
    @ApiProperty({ required: true, default: false })
    includeExtraInfo: boolean
}


