import { ApiProperty } from '@nestjs/swagger';
import { Entity, Column, PrimaryColumn, PrimaryGeneratedColumn, Index } from 'typeorm';

@Entity("dashboard_view_log", { schema: "public" })

@Index("idx_dashboard_view_log_dashboardId", ["dashboardId"], { unique: false }) 
export class DashboardViewLog {
    @PrimaryGeneratedColumn({
        type: "bigint",
        name: "id",
    })
    id: number;

    @Column({ type: "bigint", name: "dashboard_id", })
    dashboardId: number;

    @Column("timestamp with time zone", {
        name: "created_at"
    })
    createdAt: Date;

    @Column({
        type: "text",
        name: "viewer_account_id",
    })
    viewerAccountId: string;

    @Column({
        type: "text",
        name: "referral_code",
    })
    referralCode: string;


}