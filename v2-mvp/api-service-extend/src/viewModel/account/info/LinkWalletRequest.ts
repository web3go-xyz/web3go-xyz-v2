import { ApiProperty } from "@nestjs/swagger";

export class LinkWalletRequest {
    @ApiProperty({ required: true })
    accountId: string;
}