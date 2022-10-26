import { ApiProperty } from "@nestjs/swagger";

export class UnlinkWalletRequest {
    @ApiProperty({ required: true })
    accountId: string;

    @ApiProperty({ required: true })
    address: string;

    @ApiProperty({ required: true, description: 'chain name, eg: Polkadot, BSC' })
    chain: string;
}