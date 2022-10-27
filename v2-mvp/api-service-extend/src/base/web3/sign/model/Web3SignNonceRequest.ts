import { ApiProperty } from "@nestjs/swagger";

export class Web3SignNonceRequest {

    @ApiProperty({ description: 'chain name, eg: Polkadot, BSC', required: true })
    chain: string;

    @ApiProperty({ description: 'wallet source, eg: Polkadot.js, Metamask', required: true })
    walletSource: string;

    @ApiProperty({ description: 'address', required: true })
    address: string;

    @ApiProperty({
        description: 'description for current nonce, it will be a part of challenge in response',
        required: true,
        default: 'sign'
    })
    nonce_description: string;

}