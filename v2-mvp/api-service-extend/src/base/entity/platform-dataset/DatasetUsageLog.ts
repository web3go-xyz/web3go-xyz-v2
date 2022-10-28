import { ApiProperty } from '@nestjs/swagger';
import { Entity, Column, PrimaryColumn, PrimaryGeneratedColumn } from 'typeorm';

@Entity("dataset_usage_log", { schema: "public" })
export class DatasetUsageLog {
    @PrimaryGeneratedColumn({
        type: "bigint",
        name: "id",
    })
    id: number;

    @Column({ type: "bigint", name: "dataset_id", })
    datasetId: number;

    @Column({ type: "bigint", name: "dashboard_id", })
    dashboardId: number;


    @Column({
        type: "text",
        name: "account_id",
    })
    accountId: string;

    @Column("timestamp with time zone", {
        name: "created_at"
    })
    createdAt: Date;


}