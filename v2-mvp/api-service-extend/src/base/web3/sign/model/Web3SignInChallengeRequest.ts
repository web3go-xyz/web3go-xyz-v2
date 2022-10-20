import { ApiProperty } from "@nestjs/swagger";

export class Web3SignInChallengeRequest {

    @ApiProperty({ description: 'chain name, eg: Polkadot, BSC', })
    chain: string;

    @ApiProperty({ description: 'wallet source, eg: Polkadot.js, Metamask', })
    walletSource: string;

    @ApiProperty()
    address: string;

    @ApiProperty()
    scope: string[];

    @ApiProperty()
    challenge: string;

    @ApiProperty()
    nonce: string;

    @ApiProperty()
    signature: string;






} 