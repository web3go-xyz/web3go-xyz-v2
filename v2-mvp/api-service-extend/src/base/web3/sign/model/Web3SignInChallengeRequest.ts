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

    @ApiProperty({
        required: true,
        description: "For polkadot, the challenge will use value returned from web3_nonce directly.   For BSC, the challenge will be created by Siwe package, refer to: https://github.com/web3go-xyz/parachain_smart_notify_services/blob/main/ui/simple-board/src/views/signin/index.vue"
    })
    challenge: string;

    @ApiProperty({ required: true })
    nonce: string;

    @ApiProperty({
        required: true,
        description: "For polkadot, sign by polkadot.js. For BSC, sign with Siwe package, refer to: https://github.com/web3go-xyz/parachain_smart_notify_services/blob/main/ui/simple-board/src/views/signin/index.vue"
    })
    signature: string;






} 