import { ApiProperty } from "@nestjs/swagger";

export class Web3SignNonceResponse {

    @ApiProperty({ description: 'challenge needs to be sign' })
    challenge: string;

    @ApiProperty({ description: 'nonce to prevent replay-attack' })
    nonce: string;

    @ApiProperty({ description: 'chain name, eg: Polkadot, BSC', })
    chain: string;

    @ApiProperty({ description: 'wallet source, eg: Polkadot.js, Metamask', })
    walletSource: string;

    @ApiProperty({ description: 'address', })
    address: string;
}