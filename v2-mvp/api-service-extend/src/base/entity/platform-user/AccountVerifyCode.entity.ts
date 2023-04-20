import { ApiProperty } from '@nestjs/swagger';
import { Entity, Column, PrimaryColumn, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class AccountVerifyCode {
    @ApiProperty()
    @PrimaryGeneratedColumn({
        type: 'bigint', comment: '',
    })
    id: number;

    @ApiProperty()
    @Column({
        comment: 'verify type, support: email,discord,telegram,etc.',
        nullable: false,
        name: 'verify_type'
    })
    verifyType: string;

    @ApiProperty()
    @Column({
        comment: 'verify purpose, refer to VerifyCodePurpose.',
        nullable: false
    })
    purpose: string;

    @ApiProperty()
    @Column({
        comment: 'key, the value can be: email, discord name, telegram name,etc.',
        nullable: false,
        name: 'verify_key'
    })
    verifyKey: string;

    @ApiProperty()
    @Column({
        comment: 'verified code as 6 numbers',
        nullable: false,

    })
    code: string;

    @ApiProperty()
    @Column({
        type: 'text',
        comment: '',
        nullable: true,
        name: 'account_id'
    })
    accountId: string;

    @ApiProperty()
    @Column({
        comment: 'created time',
        default: '2022-01-01',
        nullable: false
    })
    created_time: Date;

    @ApiProperty()
    @Column({
        comment: 'code expired time, the code must be used before expired, otherwise need to generate new code',
        default: '2022-01-01',
        nullable: false
    })
    expired_time: Date;
}