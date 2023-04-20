import { ApiProperty } from '@nestjs/swagger';
import { Entity, Column, PrimaryColumn, PrimaryGeneratedColumn, Index } from 'typeorm';

@Entity("dashboard_tag", { schema: "public" })
@Index("idx_dashboard_tag_tagId", ["tagId"], { unique: false })
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