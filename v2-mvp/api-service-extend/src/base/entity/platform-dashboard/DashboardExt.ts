import { ApiProperty } from '@nestjs/swagger';
import { Entity, Column, PrimaryColumn, Index } from 'typeorm';

@Entity("dashboard_ext", { schema: "public" })
@Index("idx_dashboard_ext_creatorAccountId", ["creatorAccountId"], { unique: false })
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

    @Column({
        name: "created_at"
    })
    createdAt: Date;

    @Column({
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
        name: "favorite_count",
        type: "integer",
        default: 0
    })
    favoriteCount: number;



    @Column({
        type: "text",
        name: "public_uuid",
        comment: "public_uuid, refer to metatbase.report_dashboard.public_uuid",
        default: '',
        nullable: true
    })
    publicUUID: string;

    @Column({
        type: "text",
        name: "public_link",
        comment: "publick link, formatted with public_uuid",
        default: '',
        nullable: true
    })
    publicLink: string;


    @Column({
        name: "preview_img",
        comment: 'Preview image url'
    })
    previewImg?: string;

    @Column({
        name: "latest_refresh_time",
        nullable: true,
        comment: 'latest refresh time for the dashboard, not used yet.'
    })
    latestRefreshTime?: Date;
}