import { ApiProperty } from '@nestjs/swagger';
import { Entity, Column, PrimaryColumn, PrimaryGeneratedColumn, Index } from 'typeorm';

@Entity("dashboard_share_log", { schema: "public" })
@Index("idx_dashboard_share_log_dashboardId", ["dashboardId"], { unique: false })
@Index("idx_dashboard_share_log_accountId", ["accountId"], { unique: false })
@Index("idx_dashboard_share_log_shareChannel", ["shareChannel"], { unique: false })
export class DashboardShareLog {
    @PrimaryGeneratedColumn({
        type: "bigint",
        name: "id",
    })
    id: number;

    @Column({ type: "bigint", name: "dashboard_id", })
    dashboardId: number;

    @Column({
        type: "text",
        name: "account_id",
    })
    accountId: string;

    @Column("timestamp with time zone", {
        name: "created_at"
    })
    createdAt: Date;


    @Column({
        type: "text",
        name: "share_channel",
        comment:'eg: twitter, discord, link'
    })
    shareChannel: string;

    @Column({
        type: "text",
        name: "referral_code",
    })
    referralCode: string;


}