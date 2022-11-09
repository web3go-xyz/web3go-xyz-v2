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

    @Column({ type: "text", name: "item_type", comment: 'support dashboard,dataset,etc.' })
    itemType: string;

    @Column({ type: "text", name: "item_id", comment: 'it would be dashboard_id, dataset_id,etc.' })
    itemId: string;

    @Column({
        type: "text",
        name: "account_id",
    })
    accountId: string;

    @Column({
        type: "text",
        name: "share_channel",
    })
    shareChannel: string;


    @Column("timestamp with time zone", {
        name: "created_at"
    })
    createdAt: Date;

}