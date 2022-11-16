import { ApiProperty } from '@nestjs/swagger';
import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity()
export class Account {
    @ApiProperty()
    @PrimaryColumn({
        type: 'text',
        comment: 'unique identity id for user',
        nullable: false,
        name: 'account_id'
    })
    accountId: string;

    @ApiProperty()
    @Column({
        comment: 'web3 id defined, will used as DID, default value will be Web3Go<number>, user can mint their own ID later.',
        name: 'web3_id',
        nullable: false
    })
    web3Id: string;

    @ApiProperty()
    @Column({
        comment: 'user friendly name for display',
        nullable: true,
        name: 'nick_name'
    })
    nickName: string;


    @ApiProperty()
    @Column({
        comment: 'avatar image base64', type: 'text',
        nullable: true
    })
    avatar: string = "";


    @ApiProperty()
    @Column({
        comment: 'account created time', default: '2022-01-01',
        nullable: false
    })
    created_time: Date;


    @ApiProperty()
    @Column({
        comment: 'user allow login status, default =1 , set to 0 when disabled.',
        type: 'int',
        default: 1,
        name: 'allow_login'
    })
    allowLogin: number = 1;

    @ApiProperty()
    @Column({ comment: '', name: 'last_login_time', default: '2022-01-01' })
    lastLoginTime: Date;


    @ApiProperty({
        description: 'count for how many addresses current account are followed by.  others=>current',
    })
    @Column({
        name: "followed_account_count",
        type: "integer",
        default: 0,
        comment: 'count for how many addresses current account are followed by.  others=>current'
    })
    followedAccountCount: number;


    @ApiProperty({
        description: 'count for how many accounts have been followed by current account,  current=>others',
    })
    @Column({
        name: "following_account_count",
        type: "integer",
        default: 0,
        comment: 'count for how many accounts have been followed by current account,  current=>others'
    })
    followingAccountCount: number;
}