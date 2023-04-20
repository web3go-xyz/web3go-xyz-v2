import { Entity, Column, PrimaryColumn, PrimaryGeneratedColumn } from 'typeorm';

@Entity("dataset_share_log", { schema: "public" })
export class DatasetShareLog { 
    @PrimaryGeneratedColumn({
        type: "bigint",
        name: "id",
    })
    id: number;

    @Column({ type: "bigint", name: "dataset_id", })
    datasetId: number;

    @Column({
        type: "text",
        name: "account_id",
    })
    accountId: string;

    @Column( {
        name: "created_at"
    })
    createdAt: Date;


    @Column({
        type: "text",
        name: "share_channel",
        comment:'eg: twitter, discord, link'
    })
    shareChannel: string;

    @Column({
        type: "text",
        name: "referral_code",
    })
    referralCode: string;

}