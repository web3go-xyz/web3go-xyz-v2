import { ApiProperty } from '@nestjs/swagger';
import { Entity, Column, PrimaryColumn, PrimaryGeneratedColumn, Index } from 'typeorm';

@Entity("share_referral_code", { schema: "public" })
@Index(['referralCode'], { unique: true })
export class ShareReferralCode {
    @PrimaryGeneratedColumn({
        type: "bigint",
        name: "id",
    })
    id: number;

    @Column({
        type: "text",
        name: "referral_code",
    })
    referralCode: string;

    @Column({ type: "text", name: "category", comment: 'support: dashboard,dataset' })
    category: string;


    @Column({ type: "text", name: "refer_item_id", comment: 'refer to the actual dashboard_id, dataset_id,etc.' })
    referItemID: string;


    @Column({ type: "text", name: "public_uuid", comment: 'it would be uuid, comes from metabase tables. eg: report_dashboard.public_uuid' })
    publicUUID: string;

    @Column({ type: "text", name: "public_link", comment: 'link when share public' })
    shareLink: string;

    @Column({
        type: "text",
        name: "account_id",
    })
    accountId: string;

    @Column({
        type: "text",
        name: "share_channel",
        comment: 'eg: twitter, discord, link'
    })
    shareChannel: string;


    @Column({
        name: "created_at"
    })
    createdAt: Date;

}