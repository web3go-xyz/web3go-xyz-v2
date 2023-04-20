import { ApiProperty } from "@nestjs/swagger";

export class Web3SignChallengeResponse {

    @ApiProperty({ description: 'chain name, eg: Polkadot, BSC', })
    chain: string;

    @ApiProperty({ description: 'wallet source, eg: Polkadot.js, Metamask', })
    walletSource: string;

    @ApiProperty({ description: 'address', })
    address: string;

    @ApiProperty({ description: `original challenge` })
    challenge: string;

    @ApiProperty({ description: 'original signature' })
    signature: string;

    @ApiProperty({ description: `verified result` })
    verified: boolean;

    @ApiProperty({ description: 'if verified passed, it will contain extra info like token or account info' })
    extra: any;
} 