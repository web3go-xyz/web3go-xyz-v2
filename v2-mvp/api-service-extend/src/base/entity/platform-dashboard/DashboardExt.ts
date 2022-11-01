import { ApiProperty } from '@nestjs/swagger';
import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity("dashboard_ext", { schema: "public" })
export class DashboardExt {
    @PrimaryColumn({
        type: "integer",
        name: "id",
        comment: "refer to metabase.report_dashboard.id"
    })
    id: number;

    @Column({ type: "text", name: "name", comment: 'dashboard name' })
    name: string;

    @Column({
        type: "text", name: "description",
        comment: 'dashboard description',
        nullable: true,
        default: ''
    })
    description: string;

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




    @ApiProperty({
        description: 'view count',
    })
    @Column({
        name: "view_count",
        type: "integer",
        default: 0
    })
    viewCount: number;

    @ApiProperty({
        description: 'share count',
    })
    @Column({
        name: "share_count",
        type: "integer",
        default: 0
    })
    shareCount: number;

    @ApiProperty({
        description: 'fork count',
    })
    @Column({
        name: "fork_count",
        type: "integer",
        default: 0
    })
    forkCount: number;

    @ApiProperty({
        description: 'favorite count',
    })
    @Column({
        name: "favorite_ount",
        type: "integer",
        default: 0
    })
    favoriteCount: number;
}