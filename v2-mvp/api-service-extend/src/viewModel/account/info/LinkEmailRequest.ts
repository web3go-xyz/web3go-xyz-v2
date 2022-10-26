import { ApiProperty } from "@nestjs/swagger";

export class LinkEmailRequest {
    @ApiProperty({ required: true })
    accountId: string;
}