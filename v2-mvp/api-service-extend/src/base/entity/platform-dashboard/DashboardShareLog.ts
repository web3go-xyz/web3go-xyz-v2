import { ApiProperty } from '@nestjs/swagger';
import { Entity, Column, PrimaryColumn, PrimaryGeneratedColumn } from 'typeorm';

@Entity("dashboard_share_log", { schema: "public" })
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
    })
    shareChannel: string;

    @Column({
        type: "text",
        name: "referral_code",
    })
    referralCode: string;


}