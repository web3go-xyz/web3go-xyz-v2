import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { ReportDashboard } from "./ReportDashboard";
import { CoreUser } from "./CoreUser";

@Index("idx_dashboard_bookmark_dashboard_id", ["dashboardId"], {})
@Index(
  "unique_dashboard_bookmark_user_id_dashboard_id",
  ["dashboardId", "userId"],
  { unique: true }
)
@Index("dashboard_bookmark_pkey", ["id"], { unique: true })
@Index("idx_dashboard_bookmark_user_id", ["userId"], {})
@Entity("dashboard_bookmark", { schema: "public" })
export class DashboardBookmark {
  @PrimaryGeneratedColumn({ type: "integer", name: "id" })
  id: number;

  @Column("integer", { name: "user_id", unique: true })
  userId: number;

  @Column("integer", { name: "dashboard_id", unique: true })
  dashboardId: number;

  @Column("timestamp with time zone", {
    name: "created_at",
    default: () => "now()",
  })
  createdAt: Date;

  @ManyToOne(
    () => ReportDashboard,
    (reportDashboard) => reportDashboard.dashboardBookmarks,
    { onDelete: "CASCADE" }
  )
  @JoinColumn([{ name: "dashboard_id", referencedColumnName: "id" }])
  dashboard: ReportDashboard;

  @ManyToOne(() => CoreUser, (coreUser) => coreUser.dashboardBookmarks, {
    onDelete: "CASCADE",
  })
  @JoinColumn([{ name: "user_id", referencedColumnName: "id" }])
  user: CoreUser;
}
