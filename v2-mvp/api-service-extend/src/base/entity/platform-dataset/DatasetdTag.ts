import { ApiProperty } from '@nestjs/swagger';
import { Entity, Column, PrimaryColumn, PrimaryGeneratedColumn, Index } from 'typeorm';

@Entity("dataset_tag", { schema: "public" })
@Index("idx_dataset_tag_tagId", ["tagId"], { unique: false })
export class DatasetTag {

    @PrimaryColumn({
        type: "bigint",
        name: "dataset_id",
    })
    datasetId: number;

    @PrimaryColumn({
        type: "bigint",
        name: "tag_id",
    })
    tagId: number;

    @Column({
        name: "created_at"
    })
    createdAt: Date;

    @Column({
        type: "text",
        name: "creator",
    })
    creator: string;

}