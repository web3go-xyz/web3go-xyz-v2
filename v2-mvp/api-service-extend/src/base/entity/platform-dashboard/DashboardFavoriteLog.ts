import { ApiProperty } from '@nestjs/swagger';
import { Entity, Column, PrimaryColumn, PrimaryGeneratedColumn, Index } from 'typeorm';

@Entity("dashboard_favorite_log", { schema: "public" })
@Index("idx_dashboard_favorite_log_accountId", ["accountId"], { unique: false })
@Index("idx_dashboard_favorite_log_dashboardId", ["dashboardId"], { unique: false })
export class DashboardFavoriteLog {
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

    @Column({
        name: "created_at"
    })
    createdAt: Date;




}