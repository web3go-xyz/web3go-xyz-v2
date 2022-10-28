import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { CoreUser } from "./CoreUser";
import { MetabaseTable } from "./MetabaseTable";

@Index("idx_segment_creator_id", ["creatorId"], {})
@Index("segment_entity_id_key", ["entityId"], { unique: true })
@Index("segment_pkey", ["id"], { unique: true })
@Index("idx_segment_show_in_getting_started", ["showInGettingStarted"], {})
@Index("idx_segment_table_id", ["tableId"], {})
@Entity("segment", { schema: "public" })
export class Segment {
  @PrimaryGeneratedColumn({ type: "integer", name: "id" })
  id: number;

  @Column("integer", { name: "table_id" })
  tableId: number;

  @Column("integer", { name: "creator_id" })
  creatorId: number;

  @Column("character varying", { name: "name", length: 254 })
  name: string;

  @Column("text", { name: "description", nullable: true })
  description: string | null;

  @Column("boolean", { name: "archived", default: () => "false" })
  archived: boolean;

  @Column("text", { name: "definition" })
  definition: string;

  @Column("timestamp with time zone", { name: "created_at" })
  createdAt: Date;

  @Column("timestamp with time zone", { name: "updated_at" })
  updatedAt: Date;

  @Column("text", { name: "points_of_interest", nullable: true })
  pointsOfInterest: string | null;

  @Column("text", { name: "caveats", nullable: true })
  caveats: string | null;

  @Column("boolean", {
    name: "show_in_getting_started",
    default: () => "false",
  })
  showInGettingStarted: boolean;

  @Column("character", {
    name: "entity_id",
    nullable: true,
    unique: true,
    length: 21,
  })
  entityId: string | null;

  @ManyToOne(() => CoreUser, (coreUser) => coreUser.segments, {
    onDelete: "CASCADE",
  })
  @JoinColumn([{ name: "creator_id", referencedColumnName: "id" }])
  creator: CoreUser;

  @ManyToOne(() => MetabaseTable, (metabaseTable) => metabaseTable.segments, {
    onDelete: "CASCADE",
  })
  @JoinColumn([{ name: "table_id", referencedColumnName: "id" }])
  table: MetabaseTable;
}
