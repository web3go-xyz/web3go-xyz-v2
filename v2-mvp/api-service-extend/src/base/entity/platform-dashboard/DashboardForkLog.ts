import { ApiProperty } from '@nestjs/swagger';
import { Entity, Column, PrimaryColumn, PrimaryGeneratedColumn } from 'typeorm';

@Entity("dashboard_fork_log", { schema: "public" })
export class DashboardForkLog {
    @PrimaryGeneratedColumn({
        type: "bigint",
        name: "id",
    })
    id: number;

    @Column({
        type: "text",
        name: "account_id",
    })
    accountId: string;

    @Column({ type: "bigint", name: "original_dashboard_id", })
    originalDashboardId: number;


    @Column({ type: "bigint", name: "forked_dashboard_id", comment: 'new dashboard id created' })
    forkedDashboardId: number;

    @Column("timestamp with time zone", {
        name: "created_at"
    })
    createdAt: Date;




}