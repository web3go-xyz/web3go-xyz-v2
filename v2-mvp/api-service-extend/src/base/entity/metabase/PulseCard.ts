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
import { Pulse } from "./Pulse";

@Index("idx_pulse_card_card_id", ["cardId"], {})
@Index("pulse_card_entity_id_key", ["entityId"], { unique: true })
@Index("pulse_card_pkey", ["id"], { unique: true })
@Index("idx_pulse_card_pulse_id", ["pulseId"], {})
@Entity("pulse_card", { schema: "public" })
export class PulseCard {
  @PrimaryGeneratedColumn({ type: "integer", name: "id" })
  id: number;

  @Column("integer", { name: "pulse_id" })
  pulseId: number;

  @Column("integer", { name: "card_id" })
  cardId: number;

  @Column("integer", { name: "position" })
  position: number;

  @Column("boolean", { name: "include_csv", default: () => "false" })
  includeCsv: boolean;

  @Column("boolean", { name: "include_xls", default: () => "false" })
  includeXls: boolean;

  @Column("character", {
    name: "entity_id",
    nullable: true,
    unique: true,
    length: 21,
  })
  entityId: string | null;

  @ManyToOne(() => ReportCard, (reportCard) => reportCard.pulseCards, {
    onDelete: "CASCADE",
  })
  @JoinColumn([{ name: "card_id", referencedColumnName: "id" }])
  card: ReportCard;

  @ManyToOne(
    () => ReportDashboardcard,
    (reportDashboardcard) => reportDashboardcard.pulseCards,
    { onDelete: "CASCADE" }
  )
  @JoinColumn([{ name: "dashboard_card_id", referencedColumnName: "id" }])
  dashboardCard: ReportDashboardcard;

  @ManyToOne(() => Pulse, (pulse) => pulse.pulseCards, { onDelete: "CASCADE" })
  @JoinColumn([{ name: "pulse_id", referencedColumnName: "id" }])
  pulse: Pulse;
}
