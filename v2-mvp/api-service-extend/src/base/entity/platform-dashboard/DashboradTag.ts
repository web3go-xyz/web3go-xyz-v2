import { ApiProperty } from '@nestjs/swagger';
import { Entity, Column, PrimaryColumn, PrimaryGeneratedColumn } from 'typeorm';

@Entity("dashboard_tag", { schema: "public" })
export class DashboardTag {

    @PrimaryColumn({
        type: "bigint",
        name: "dashboard_id",
    })
    dashboardId: number;

    @PrimaryColumn({
        type: "bigint",
        name: "tag_id",
    })
    tagId: number;

    @Column("timestamp with time zone", {
        name: "created_at"
    })
    createdAt: Date;

    @Column({
        type: "text",
        name: "creator",
    })
    creator: string;


}