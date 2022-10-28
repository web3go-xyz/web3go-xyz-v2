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


}