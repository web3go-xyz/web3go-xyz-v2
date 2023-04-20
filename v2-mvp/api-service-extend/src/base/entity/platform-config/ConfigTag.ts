import { ApiProperty } from '@nestjs/swagger';
import { Entity, Column, PrimaryColumn, PrimaryGeneratedColumn } from 'typeorm';

@Entity("config_tag", { schema: "public" })
export class ConfigTag {
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