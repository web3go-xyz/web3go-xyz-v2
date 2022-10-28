import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { CoreUser } from "./CoreUser";
import { Timeline } from "./Timeline";

@Index("timeline_event_pkey", ["id"], { unique: true })
@Index("idx_timeline_event_timeline_id", ["timelineId"], {})
@Index(
  "idx_timeline_event_timeline_id_timestamp",
  ["timelineId", "timestamp"],
  {}
)
@Entity("timeline_event", { schema: "public" })
export class TimelineEvent {
  @PrimaryGeneratedColumn({ type: "integer", name: "id" })
  id: number;

  @Column("integer", { name: "timeline_id" })
  timelineId: number;

  @Column("character varying", { name: "name", length: 255 })
  name: string;

  @Column("character varying", {
    name: "description",
    nullable: true,
    length: 255,
  })
  description: string | null;

  @Column("timestamp with time zone", { name: "timestamp" })
  timestamp: Date;

  @Column("boolean", { name: "time_matters" })
  timeMatters: boolean;

  @Column("character varying", { name: "timezone", length: 255 })
  timezone: string;

  @Column("character varying", { name: "icon", length: 128 })
  icon: string;

  @Column("boolean", { name: "archived", default: () => "false" })
  archived: boolean;

  @Column("timestamp with time zone", {
    name: "created_at",
    default: () => "now()",
  })
  createdAt: Date;

  @Column("timestamp with time zone", {
    name: "updated_at",
    default: () => "now()",
  })
  updatedAt: Date;

  @ManyToOne(() => CoreUser, (coreUser) => coreUser.timelineEvents, {
    onDelete: "CASCADE",
  })
  @JoinColumn([{ name: "creator_id", referencedColumnName: "id" }])
  creator: CoreUser;

  @ManyToOne(() => Timeline, (timeline) => timeline.timelineEvents, {
    onDelete: "CASCADE",
  })
  @JoinColumn([{ name: "timeline_id", referencedColumnName: "id" }])
  timeline: Timeline;
}
