import { ApiProperty } from '@nestjs/swagger';
import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity()
export class AccountEmail {
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
        comment: '',
        nullable: false
    })
    email: string;


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

    @ApiProperty()
    @Column({
        comment: 'password hashed. for login by emails, each email has its own password',
        nullable: true, default: '',
        name: 'password_hash'
    })
    password_hash: string;
}