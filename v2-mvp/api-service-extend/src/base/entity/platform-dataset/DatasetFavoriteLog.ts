import { ApiProperty } from '@nestjs/swagger';
import { Entity, Column, PrimaryColumn, PrimaryGeneratedColumn } from 'typeorm';

@Entity("dataset_favorite_log", { schema: "public" })
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

    @Column({
        name: "created_at"
    })
    createdAt: Date;




}