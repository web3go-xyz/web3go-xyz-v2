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

@Index(
  "unique_dashboard_favorite_user_id_dashboard_id",
  ["dashboardId", "userId"],
  { unique: true }
)
@Index("idx_dashboard_favorite_dashboard_id", ["dashboardId"], {})
@Index("dashboard_favorite_pkey", ["id"], { unique: true })
@Index("idx_dashboard_favorite_user_id", ["userId"], {})
@Entity("dashboard_favorite", { schema: "public" })
export class DashboardFavorite {
  @PrimaryGeneratedColumn({ type: "integer", name: "id" })
  id: number;

  @Column("integer", { name: "user_id", unique: true })
  userId: number;

  @Column("integer", { name: "dashboard_id", unique: true })
  dashboardId: number;

  @ManyToOne(
    () => ReportDashboard,
    (reportDashboard) => reportDashboard.dashboardFavorites,
    { onDelete: "CASCADE" }
  )
  @JoinColumn([{ name: "dashboard_id", referencedColumnName: "id" }])
  dashboard: ReportDashboard;

  @ManyToOne(() => CoreUser, (coreUser) => coreUser.dashboardFavorites, {
    onDelete: "CASCADE",
  })
  @JoinColumn([{ name: "user_id", referencedColumnName: "id" }])
  user: CoreUser;
}
