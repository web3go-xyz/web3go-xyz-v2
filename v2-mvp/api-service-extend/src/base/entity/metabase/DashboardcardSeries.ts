import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { ReportCard } from "./ReportCard";
import { ReportDashboardcard } from "./ReportDashboardcard";

@Index("idx_dashboardcard_series_card_id", ["cardId"], {})
@Index("idx_dashboardcard_series_dashboardcard_id", ["dashboardcardId"], {})
@Index("dashboardcard_series_pkey", ["id"], { unique: true })
@Entity("dashboardcard_series", { schema: "public" })
export class DashboardcardSeries {
  @PrimaryGeneratedColumn({ type: "integer", name: "id" })
  id: number;

  @Column("integer", { name: "dashboardcard_id" })
  dashboardcardId: number;

  @Column("integer", { name: "card_id" })
  cardId: number;

  @Column("integer", { name: "position" })
  position: number;

  @ManyToOne(() => ReportCard, (reportCard) => reportCard.dashboardcardSeries, {
    onDelete: "CASCADE",
  })
  @JoinColumn([{ name: "card_id", referencedColumnName: "id" }])
  card: ReportCard;

  @ManyToOne(
    () => ReportDashboardcard,
    (reportDashboardcard) => reportDashboardcard.dashboardcardSeries,
    { onDelete: "CASCADE" }
  )
  @JoinColumn([{ name: "dashboardcard_id", referencedColumnName: "id" }])
  dashboardcard: ReportDashboardcard;
}
