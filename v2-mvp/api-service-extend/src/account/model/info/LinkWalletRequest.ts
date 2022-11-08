import { ApiProperty } from "@nestjs/swagger";

export class LinkWalletRequest {
    @ApiProperty({ required: true })
    accountId: string;

    @ApiProperty({ required: true })
    address: string;

    @ApiProperty({ required: true, description: 'chain name, eg: Polkadot, BSC' })
    chain: string;

    @ApiProperty({ required: true, description: 'wallet source, eg: Polkadot.js, Metamask' })
    walletSource: string;


    @ApiProperty({ required: true })
    challenge: string;

    @ApiProperty({ required: true })
    nonce: string;

    @ApiProperty({
        required: true,
        description: "For polkadot, sign by polkadot.js. For BSC, sign with Siwe package, refer to: https://github.com/web3go-xyz/parachain_smart_notify_services/blob/main/ui/simple-board/src/views/signin/index.vue"
    })
    signature: string;
}