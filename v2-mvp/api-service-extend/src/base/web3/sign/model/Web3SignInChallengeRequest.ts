import { ApiProperty } from "@nestjs/swagger";

export class Web3SignInChallengeRequest {

    @ApiProperty({ description: 'chain name, eg: Polkadot, BSC', required: true })
    chain: string;

    @ApiProperty({ description: 'wallet source, eg: Polkadot.js, Metamask', required: true })
    walletSource: string;

    @ApiProperty({ required: true })
    address: string;

    @ApiProperty({ required: true })
    scope: string[];

    @ApiProperty({ required: true })
    challenge: string;

    @ApiProperty({ required: true })
    nonce: string;

    @ApiProperty({ required: true })
    signature: string;






} 