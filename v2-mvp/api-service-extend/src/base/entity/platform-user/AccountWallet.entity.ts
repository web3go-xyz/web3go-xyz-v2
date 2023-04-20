import { ApiProperty } from '@nestjs/swagger';
import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity()
export class AccountWallet {
    @ApiProperty()
    @PrimaryColumn({
        type: 'text',
        comment: '',
        nullable: false,
        name: 'account_id'
    })
    accountId: string;

    @ApiProperty()
    @PrimaryColumn({
        comment: 'address',
        nullable: false,
        name: 'address'
    })
    address: string;


    @ApiProperty()
    @Column({
        comment: 'chain name, eg: Polkadot, BSC',
        nullable: false
    })
    chain: string;

    @ApiProperty()
    @Column({
        comment: 'wallet source, eg: Polkadot.js, Metamask',
        nullable: false,
        name: 'wallet_source'
    })
    walletSource: string;


    @ApiProperty()
    @Column({
        comment: 'email verified, verified=1, not verified=0',
        type: 'int',
        nullable: false,
        default: 0
    })
    verified: number;

    @ApiProperty()
    @Column({
        comment: 'created time',
        default: '2022-01-01',
        nullable: false
    })
    created_time: Date;
}