import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { CoreUser } from "./CoreUser";
import { MetabaseTable } from "./MetabaseTable";
import { MetricImportantField } from "./MetricImportantField";

@Index("idx_metric_creator_id", ["creatorId"], {})
@Index("metric_entity_id_key", ["entityId"], { unique: true })
@Index("metric_pkey", ["id"], { unique: true })
@Index("idx_metric_show_in_getting_started", ["showInGettingStarted"], {})
@Index("idx_metric_table_id", ["tableId"], {})
@Entity("metric", { schema: "public" })
export class Metric {
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

  @Column("text", { name: "how_is_this_calculated", nullable: true })
  howIsThisCalculated: string | null;

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

  @ManyToOne(() => CoreUser, (coreUser) => coreUser.metrics, {
    onDelete: "CASCADE",
  })
  @JoinColumn([{ name: "creator_id", referencedColumnName: "id" }])
  creator: CoreUser;

  @ManyToOne(() => MetabaseTable, (metabaseTable) => metabaseTable.metrics, {
    onDelete: "CASCADE",
  })
  @JoinColumn([{ name: "table_id", referencedColumnName: "id" }])
  table: MetabaseTable;

  @OneToMany(
    () => MetricImportantField,
    (metricImportantField) => metricImportantField.metric
  )
  metricImportantFields: MetricImportantField[];
}
