import { ApiProperty } from '@nestjs/swagger';
import { Entity, Column, PrimaryColumn, PrimaryGeneratedColumn } from 'typeorm';

@Entity("dataset_tag_group", { schema: "public" })
export class DatasetTagGroup {
    @PrimaryGeneratedColumn({
        type: "bigint",
        name: "id",
    })
    id: number;

    @Column({
        type: "text",
        name: "tag_name",
    })
    tagName: string;

    @Column({
        type: "text",
        name: "tag_description",
    })
    tagDescription: string;

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