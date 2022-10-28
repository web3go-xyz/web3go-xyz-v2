import { ApiProperty } from '@nestjs/swagger';
import { Entity, Column, PrimaryColumn, PrimaryGeneratedColumn } from 'typeorm';

@Entity("ad_course", { schema: "public" })
export class AdCourse {

    @PrimaryGeneratedColumn({
        type: "integer",
        name: "id",
    })
    id: number;

    @Column({
        type: "text", name: "thumbnail",
        comment: 'thumbnail for course article'
    })
    thumbnail: string;

    @Column({
        type: "text",
        name: "title",
    })
    title: string;

    @Column({
        type: "text",
        name: "brief",
    })
    brief: string;

    @Column({
        type: "text",
        name: "link",
    })
    link: string;

    @Column("timestamp with time zone", {
        name: "created_at"
    })
    createdAt: Date;

    @Column({
        type: "integer",
        name: "display_rank"
    })
    displayRank: number;

}