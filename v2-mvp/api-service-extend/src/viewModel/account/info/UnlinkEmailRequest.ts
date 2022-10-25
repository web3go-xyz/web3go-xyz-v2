import { ApiProperty } from "@nestjs/swagger";

export class UnlinkEmailRequest {
    @ApiProperty({ required: true })
    accountId: string;
}