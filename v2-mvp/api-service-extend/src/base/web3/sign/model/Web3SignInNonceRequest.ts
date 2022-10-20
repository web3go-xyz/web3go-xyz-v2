import { ApiProperty } from "@nestjs/swagger";

export class Web3SignInNonceRequest {

    @ApiProperty({ description: 'chain name, eg: Polkadot, BSC', })
    chain: string;

    @ApiProperty({ description: 'wallet source, eg: Polkadot.js, Metamask', })
    walletSource: string;

    @ApiProperty({ description: 'address', })
    address: string;
}