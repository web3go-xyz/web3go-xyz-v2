import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Pulse } from "./Pulse";
import { PulseChannelRecipient } from "./PulseChannelRecipient";

@Index("pulse_channel_entity_id_key", ["entityId"], { unique: true })
@Index("pulse_channel_pkey", ["id"], { unique: true })
@Index("idx_pulse_channel_pulse_id", ["pulseId"], {})
@Index("idx_pulse_channel_schedule_type", ["scheduleType"], {})
@Entity("pulse_channel", { schema: "public" })
export class PulseChannel {
  @PrimaryGeneratedColumn({ type: "integer", name: "id" })
  id: number;

  @Column("integer", { name: "pulse_id" })
  pulseId: number;

  @Column("character varying", { name: "channel_type", length: 32 })
  channelType: string;

  @Column("text", { name: "details" })
  details: string;

  @Column("character varying", { name: "schedule_type", length: 32 })
  scheduleType: string;

  @Column("integer", { name: "schedule_hour", nullable: true })
  scheduleHour: number | null;

  @Column("character varying", {
    name: "schedule_day",
    nullable: true,
    length: 64,
  })
  scheduleDay: string | null;

  @Column("timestamp with time zone", { name: "created_at" })
  createdAt: Date;

  @Column("timestamp with time zone", { name: "updated_at" })
  updatedAt: Date;

  @Column("character varying", {
    name: "schedule_frame",
    nullable: true,
    length: 32,
  })
  scheduleFrame: string | null;

  @Column("boolean", { name: "enabled", default: () => "true" })
  enabled: boolean;

  @Column("character", {
    name: "entity_id",
    nullable: true,
    unique: true,
    length: 21,
  })
  entityId: string | null;

  @ManyToOne(() => Pulse, (pulse) => pulse.pulseChannels, {
    onDelete: "CASCADE",
  })
  @JoinColumn([{ name: "pulse_id", referencedColumnName: "id" }])
  pulse: Pulse;

  @OneToMany(
    () => PulseChannelRecipient,
    (pulseChannelRecipient) => pulseChannelRecipient.pulseChannel
  )
  pulseChannelRecipients: PulseChannelRecipient[];
}
