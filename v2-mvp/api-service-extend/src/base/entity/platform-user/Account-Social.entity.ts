import { ApiProperty } from '@nestjs/swagger';
import { Entity, Column, PrimaryGeneratedColumn, PrimaryColumn } from 'typeorm';

@Entity()
export class AccountSocial {
    @ApiProperty()
    @PrimaryColumn({
        type: 'text',
        comment: '',
        nullable: false
    })
    accountId: string;

    @ApiProperty()
    @PrimaryColumn({
        comment: '',
        nullable: false,
        name: 'social_link'
    })
    socialLink: string;

    @ApiProperty()
    @Column({
        comment: 'social type, eg: twitter, discord, telegram, github',
        name: 'social_type',
        nullable: false
    })
    socialType: string;



    @ApiProperty()
    @Column({
        comment: 'created time',
        default: '2022-01-01',
        nullable: false
    })
    created_time: Date;
}