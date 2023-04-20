import { ApiProperty } from "@nestjs/swagger";

export class Web3SignChallengeRequest {

    @ApiProperty({
        description: 'chain name, eg: Polkadot, BSC',
        required: true
    })
    chain: string;

    @ApiProperty({
        description: 'wallet source, eg: Polkadot.js, Metamask',
        required: true
    })
    walletSource: string;

    @ApiProperty({
        required: true,
        description: 'wallet address'
    })
    address: string;

    @ApiProperty({
        required: true,
        description: "For polkadot, the challenge will use value returned from web3_nonce directly.   For BSC, the challenge will be created by Siwe package, refer to: https://github.com/web3go-xyz/parachain_smart_notify_services/blob/main/ui/simple-board/src/views/signin/index.vue"
    })
    challenge: string;

    @ApiProperty({
        required: true,
        description: 'nonce'
    })
    nonce: string;

    @ApiProperty({
        required: true,
        description: "signature for challenge by wallet. For polkadot, sign with polkadot.js. For BSC, sign with Siwe package, refer to: https://github.com/web3go-xyz/parachain_smart_notify_services/blob/main/ui/simple-board/src/views/signin/index.vue"
    })
    signature: string;






} 