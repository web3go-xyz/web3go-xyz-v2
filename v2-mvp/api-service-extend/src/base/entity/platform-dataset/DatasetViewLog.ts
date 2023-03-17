import { ApiProperty } from '@nestjs/swagger';
import { Entity, Column, PrimaryColumn, PrimaryGeneratedColumn, Index } from 'typeorm';

@Entity("dataset_view_log", { schema: "public" })

@Index("idx_dataset_view_log_dashboardId", ["datasetId"], { unique: false }) 
export class DatasetViewLog {
    @PrimaryGeneratedColumn({
        type: "bigint",
        name: "id",
    })
    id: number;

    @Column({ type: "bigint", name: "dateset_id", })
    datasetId: number;

    @Column("timestamp with time zone", {
        name: "created_at"
    })
    createdAt: Date;

    @Column({
        type: "text",
        name: "viewer_account_id",
    })
    viewerAccountId: string;

    @Column({
        type: "text",
        name: "referral_code",
    })
    referralCode: string;


}