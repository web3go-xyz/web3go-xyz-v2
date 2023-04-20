import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { GroupTableAccessPolicy } from "./GroupTableAccessPolicy";
import { MetabaseField } from "./MetabaseField";
import { MetabaseDatabase } from "./MetabaseDatabase";
import { Metric } from "./Metric";
import { ReportCard } from "./ReportCard";
import { Segment } from "./Segment";

@Index("idx_uniq_table_db_id_schema_name", ["dbId", "name", "schema"], {
  unique: true,
})
@Index("idx_metabase_table_db_id_schema", ["dbId", "schema"], {})
@Index("idx_uniq_table_db_id_schema_name_2col", ["dbId", "name"], {
  unique: true,
})
@Index("idx_table_db_id", ["dbId"], {})
@Index("metabase_table_pkey", ["id"], { unique: true })
@Index(
  "idx_metabase_table_show_in_getting_started",
  ["showInGettingStarted"],
  {}
)
@Entity("metabase_table", { schema: "public" })
export class MetabaseTable {
  @PrimaryGeneratedColumn({ type: "integer", name: "id" })
  id: number;

  @Column("timestamp with time zone", { name: "created_at" })
  createdAt: Date;

  @Column("timestamp with time zone", { name: "updated_at" })
  updatedAt: Date;

  @Column("character varying", { name: "name", unique: true, length: 254 })
  name: string;

  @Column("text", { name: "description", nullable: true })
  description: string | null;

  @Column("character varying", {
    name: "entity_type",
    nullable: true,
    length: 254,
  })
  entityType: string | null;

  @Column("boolean", { name: "active" })
  active: boolean;

  @Column("integer", { name: "db_id", unique: true })
  dbId: number;

  @Column("character varying", {
    name: "display_name",
    nullable: true,
    length: 254,
  })
  displayName: string | null;

  @Column("character varying", {
    name: "visibility_type",
    nullable: true,
    length: 254,
  })
  visibilityType: string | null;

  @Column("character varying", {
    name: "schema",
    nullable: true,
    unique: true,
    length: 254,
  })
  schema: string | null;

  @Column("text", { name: "points_of_interest", nullable: true })
  pointsOfInterest: string | null;

  @Column("text", { name: "caveats", nullable: true })
  caveats: string | null;

  @Column("boolean", {
    name: "show_in_getting_started",
    default: () => "false",
  })
  showInGettingStarted: boolean;

  @Column("character varying", {
    name: "field_order",
    length: 254,
    default: () => "'database'",
  })
  fieldOrder: string;

  @Column("character varying", {
    name: "initial_sync_status",
    length: 32,
    default: () => "'complete'",
  })
  initialSyncStatus: string;

  @OneToMany(
    () => GroupTableAccessPolicy,
    (groupTableAccessPolicy) => groupTableAccessPolicy.table
  )
  groupTableAccessPolicies: GroupTableAccessPolicy[];

  @OneToMany(() => MetabaseField, (metabaseField) => metabaseField.table)
  metabaseFields: MetabaseField[];

  @ManyToOne(
    () => MetabaseDatabase,
    (metabaseDatabase) => metabaseDatabase.metabaseTables,
    { onDelete: "CASCADE" }
  )
  @JoinColumn([{ name: "db_id", referencedColumnName: "id" }])
  db: MetabaseDatabase;

  @OneToMany(() => Metric, (metric) => metric.table)
  metrics: Metric[];

  @OneToMany(() => ReportCard, (reportCard) => reportCard.table_id)
  reportCards: ReportCard[];

  @OneToMany(() => Segment, (segment) => segment.table)
  segments: Segment[];
}
