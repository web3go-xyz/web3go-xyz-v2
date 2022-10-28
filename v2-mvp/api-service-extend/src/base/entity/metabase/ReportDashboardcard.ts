import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { DashboardcardSeries } from "./DashboardcardSeries";
import { PulseCard } from "./PulseCard";
import { ReportCard } from "./ReportCard";
import { ReportDashboard } from "./ReportDashboard";

@Index("idx_dashboardcard_card_id", ["cardId"], {})
@Index("idx_dashboardcard_dashboard_id", ["dashboardId"], {})
@Index("report_dashboardcard_entity_id_key", ["entityId"], { unique: true })
@Index("report_dashboardcard_pkey", ["id"], { unique: true })
@Entity("report_dashboardcard", { schema: "public" })
export class ReportDashboardcard {
  @PrimaryGeneratedColumn({ type: "integer", name: "id" })
  id: number;

  @Column("timestamp with time zone", { name: "created_at" })
  createdAt: Date;

  @Column("timestamp with time zone", { name: "updated_at" })
  updatedAt: Date;

  @Column("integer", { name: "sizeX" })
  sizeX: number;

  @Column("integer", { name: "sizeY" })
  sizeY: number;

  @Column("integer", { name: "row", default: () => "0" })
  row: number;

  @Column("integer", { name: "col", default: () => "0" })
  col: number;

  @Column("integer", { name: "card_id", nullable: true })
  cardId: number | null;

  @Column("integer", { name: "dashboard_id" })
  dashboardId: number;

  @Column("text", { name: "parameter_mappings" })
  parameterMappings: string;

  @Column("text", { name: "visualization_settings" })
  visualizationSettings: string;

  @Column("character", {
    name: "entity_id",
    nullable: true,
    unique: true,
    length: 21,
  })
  entityId: string | null;

  @OneToMany(
    () => DashboardcardSeries,
    (dashboardcardSeries) => dashboardcardSeries.dashboardcard
  )
  dashboardcardSeries: DashboardcardSeries[];

  @OneToMany(() => PulseCard, (pulseCard) => pulseCard.dashboardCard)
  pulseCards: PulseCard[];

  @ManyToOne(
    () => ReportCard,
    (reportCard) => reportCard.reportDashboardcards,
    { onDelete: "CASCADE" }
  )
  @JoinColumn([{ name: "card_id", referencedColumnName: "id" }])
  card: ReportCard;

  @ManyToOne(
    () => ReportDashboard,
    (reportDashboard) => reportDashboard.reportDashboardcards,
    { onDelete: "CASCADE" }
  )
  @JoinColumn([{ name: "dashboard_id", referencedColumnName: "id" }])
  dashboard: ReportDashboard;
}
