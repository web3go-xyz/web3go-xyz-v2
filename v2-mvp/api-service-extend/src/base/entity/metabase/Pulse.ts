import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Collection } from "./Collection";
import { CoreUser } from "./CoreUser";
import { ReportDashboard } from "./ReportDashboard";
import { PulseCard } from "./PulseCard";
import { PulseChannel } from "./PulseChannel";

@Index("idx_pulse_collection_id", ["collectionId"], {})
@Index("idx_pulse_creator_id", ["creatorId"], {})
@Index("pulse_entity_id_key", ["entityId"], { unique: true })
@Index("pulse_pkey", ["id"], { unique: true })
@Entity("pulse", { schema: "public" })
export class Pulse {
  @PrimaryGeneratedColumn({ type: "integer", name: "id" })
  id: number;

  @Column("integer", { name: "creator_id" })
  creatorId: number;

  @Column("character varying", { name: "name", nullable: true, length: 254 })
  name: string | null;

  @Column("timestamp with time zone", { name: "created_at" })
  createdAt: Date;

  @Column("timestamp with time zone", { name: "updated_at" })
  updatedAt: Date;

  @Column("boolean", { name: "skip_if_empty", default: () => "false" })
  skipIfEmpty: boolean;

  @Column("character varying", {
    name: "alert_condition",
    nullable: true,
    length: 254,
  })
  alertCondition: string | null;

  @Column("boolean", { name: "alert_first_only", nullable: true })
  alertFirstOnly: boolean | null;

  @Column("boolean", { name: "alert_above_goal", nullable: true })
  alertAboveGoal: boolean | null;

  @Column("integer", { name: "collection_id", nullable: true })
  collectionId: number | null;

  @Column("smallint", { name: "collection_position", nullable: true })
  collectionPosition: number | null;

  @Column("boolean", {
    name: "archived",
    nullable: true,
    default: () => "false",
  })
  archived: boolean | null;

  @Column("text", { name: "parameters" })
  parameters: string;

  @Column("character", {
    name: "entity_id",
    nullable: true,
    unique: true,
    length: 21,
  })
  entityId: string | null;

  @ManyToOne(() => Collection, (collection) => collection.pulses, {
    onDelete: "SET NULL",
  })
  @JoinColumn([{ name: "collection_id", referencedColumnName: "id" }])
  collection: Collection;

  @ManyToOne(() => CoreUser, (coreUser) => coreUser.pulses, {
    onDelete: "CASCADE",
  })
  @JoinColumn([{ name: "creator_id", referencedColumnName: "id" }])
  creator: CoreUser;

  @ManyToOne(
    () => ReportDashboard,
    (reportDashboard) => reportDashboard.pulses,
    { onDelete: "CASCADE" }
  )
  @JoinColumn([{ name: "dashboard_id", referencedColumnName: "id" }])
  dashboard: ReportDashboard;

  @OneToMany(() => PulseCard, (pulseCard) => pulseCard.pulse)
  pulseCards: PulseCard[];

  @OneToMany(() => PulseChannel, (pulseChannel) => pulseChannel.pulse)
  pulseChannels: PulseChannel[];
}
