import { ApiProperty } from '@nestjs/swagger';
import { Entity, Column, PrimaryColumn, PrimaryGeneratedColumn } from 'typeorm';

@Entity("dataset_fork_log", { schema: "public" })
export class DatasetForkLog {
    @PrimaryGeneratedColumn({
        type: "bigint",
        name: "id",
    })
    id: number;

    @Column({
        type: "text",
        name: "account_id",
    })
    accountId: string;

    @Column({ type: "bigint", name: "original_dataset_id", })
    originalDatasetId: number;


    @Column({ type: "bigint", name: "forked_dataset_id", })
    forkedDatasetId: number;

    @Column("timestamp with time zone", {
        name: "created_at"
    })
    createdAt: Date;




}