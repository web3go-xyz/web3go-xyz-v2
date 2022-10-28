import { ApiProperty } from '@nestjs/swagger';
import { Entity, Column, PrimaryColumn, PrimaryGeneratedColumn } from 'typeorm';

@Entity("dataset", { schema: "public" })
export class Dataset {
    @PrimaryColumn({
        type: "bigint",
        name: "dataset_id",
    })
    datasetId: number;


    @Column({ type: "text", name: "name", comment: 'dataset name' })
    name: string;

    @Column({
        type: "text",
        name: "creator_account_id",
        comment: "refer to account.accountId"
    })
    creatorAccountId: string;

    @Column("timestamp with time zone", {
        name: "created_at"
    })
    createdAt: Date;

    @Column("timestamp with time zone", {
        name: "updated_at"
    })
    updatedAt: Date;




}