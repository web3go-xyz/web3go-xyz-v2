import { ApiProperty } from "@nestjs/swagger";

export class UnlinkWalletRequest {
    @ApiProperty({ required: true })
    accountId: string;
}