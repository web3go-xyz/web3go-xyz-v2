import { ApiProperty } from '@nestjs/swagger';
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
    @ApiProperty()
    @PrimaryGeneratedColumn({ type: 'bigint' })
    userId: number;

    @ApiProperty()
    @Column({ comment: 'web3 id' })
    web3Id: string = "";

    @ApiProperty()
    @Column({ comment: 'used for login; use email as loginName for normal user ; use address as loginName for Web3 user' })
    loginName: string = "";

    @ApiProperty()
    @Column({ comment: 'password with hash encrpt' })
    passwordHash: string = "";

    @ApiProperty()
    @Column({ comment: '' })
    displayName: string = "";

    @ApiProperty()
    @Column({ comment: 'image converted as base64', type: 'text' })
    imageBase64: string = "";

    @ApiProperty()
    @Column({
        comment: 'user allow login status, default =1 , set to 0 when disabled.',
        type: 'int',
        default: 1
    })
    allowLogin: number = 1;


    @ApiProperty()
    @Column({
        comment: 'if current user registered by Web3 wallet; default =0 , set to 1 when registered by Web3 wallet.',
        type: 'int',
        default: 0
    })
    isWeb3User: number = 0;

    @ApiProperty()
    @Column({ comment: '', default: '' })
    email: string = "";

    @ApiProperty()
    @Column({ comment: 'twitter account', default: '' })
    twitter: string = "";

    @ApiProperty()
    @Column({ comment: 'github account', default: '' })
    github: string = "";


    @ApiProperty()
    @Column({ comment: '', default: '2022-01-01' })
    last_login_time: Date;
}