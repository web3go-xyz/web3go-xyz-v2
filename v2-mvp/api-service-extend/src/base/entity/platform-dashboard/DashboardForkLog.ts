import { ApiProperty } from '@nestjs/swagger';
import { Entity, Column, PrimaryColumn, PrimaryGeneratedColumn, Index } from 'typeorm';

@Entity("dashboard_fork_log", { schema: "public" })
@Index("idx_dashboard_fork_log_accountId", ["accountId"], { unique: false })
@Index("idx_dashboard_fork_log_originalDashboardId", ["originalDashboardId"], { unique: false })
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

    @Column({
        name: "created_at"
    })
    createdAt: Date;




}