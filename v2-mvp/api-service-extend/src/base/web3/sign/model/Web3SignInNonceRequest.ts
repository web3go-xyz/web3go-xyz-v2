import { ApiProperty } from "@nestjs/swagger";

export class Web3SignInNonceRequest {

    @ApiProperty({ description: 'chain name, eg: Polkadot, BSC', required: true })
    chain: string;

    @ApiProperty({ description: 'wallet source, eg: Polkadot.js, Metamask', required: true })
    walletSource: string;

    @ApiProperty({ description: 'address', required: true })
    address: string;
}