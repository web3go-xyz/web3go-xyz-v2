import { ApiProperty } from '@nestjs/swagger';
import { Entity, Column, PrimaryColumn, PrimaryGeneratedColumn } from 'typeorm';

@Entity("dataset_share_log", { schema: "public" })
export class DatasetFavoriteLog {
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

    @Column("timestamp with time zone", {
        name: "created_at"
    })
    createdAt: Date;


    @Column({
        type: "text",
        name: "share_channel",
    })
    shareChannel: string;

    @Column({
        type: "text",
        name: "referral_code",
    })
    referralCode: string;


}