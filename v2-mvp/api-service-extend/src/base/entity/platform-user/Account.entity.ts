import { ApiProperty } from '@nestjs/swagger';
import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity()
export class Account {
    @ApiProperty()
    @PrimaryColumn({
        type: 'text',
        comment: 'unique identity id for user',
        nullable: false
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
        nullable: true
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
        default: 1
    })
    allowLogin: number = 1;

    @ApiProperty()
    @Column({ comment: '', default: '2022-01-01' })
    last_login_time: Date;

}