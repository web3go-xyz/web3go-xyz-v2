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
import { TimelineEvent } from "./TimelineEvent";

@Index("idx_timeline_collection_id", ["collectionId"], {})
@Index("timeline_entity_id_key", ["entityId"], { unique: true })
@Index("timeline_pkey", ["id"], { unique: true })
@Entity("timeline", { schema: "public" })
export class Timeline {
  @PrimaryGeneratedColumn({ type: "integer", name: "id" })
  id: number;

  @Column("character varying", { name: "name", length: 255 })
  name: string;

  @Column("character varying", {
    name: "description",
    nullable: true,
    length: 255,
  })
  description: string | null;

  @Column("character varying", { name: "icon", length: 128 })
  icon: string;

  @Column("integer", { name: "collection_id", nullable: true })
  collectionId: number | null;

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

  @Column("boolean", { name: "default", default: () => "false" })
  default: boolean;

  @Column("character", {
    name: "entity_id",
    nullable: true,
    unique: true,
    length: 21,
  })
  entityId: string | null;

  @ManyToOne(() => Collection, (collection) => collection.timelines, {
    onDelete: "CASCADE",
  })
  @JoinColumn([{ name: "collection_id", referencedColumnName: "id" }])
  collection: Collection;

  @ManyToOne(() => CoreUser, (coreUser) => coreUser.timelines, {
    onDelete: "CASCADE",
  })
  @JoinColumn([{ name: "creator_id", referencedColumnName: "id" }])
  creator: CoreUser;

  @OneToMany(() => TimelineEvent, (timelineEvent) => timelineEvent.timeline)
  timelineEvents: TimelineEvent[];
}
