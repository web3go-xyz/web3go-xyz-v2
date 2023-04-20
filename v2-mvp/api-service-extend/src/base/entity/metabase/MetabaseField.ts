import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Dimension } from "./Dimension";
import { MetabaseTable } from "./MetabaseTable";
import { MetabaseFieldvalues } from "./MetabaseFieldvalues";
import { MetricImportantField } from "./MetricImportantField";

@Index("metabase_field_pkey", ["id"], { unique: true })
@Index("idx_uniq_field_table_id_parent_id_name_2col", ["name", "tableId"], {
  unique: true,
})
@Index(
  "idx_uniq_field_table_id_parent_id_name",
  ["name", "parentId", "tableId"],
  { unique: true }
)
@Index("idx_field_parent_id", ["parentId"], {})
@Index("idx_field_table_id", ["tableId"], {})
@Entity("metabase_field", { schema: "public" })
export class MetabaseField {
  @PrimaryGeneratedColumn({ type: "integer", name: "id" })
  id: number;

  @Column("timestamp with time zone", { name: "created_at" })
  createdAt: Date;

  @Column("timestamp with time zone", { name: "updated_at" })
  updatedAt: Date;

  @Column("character varying", { name: "name", unique: true, length: 254 })
  name: string;

  @Column("character varying", { name: "base_type", length: 255 })
  baseType: string;

  @Column("character varying", {
    name: "semantic_type",
    nullable: true,
    length: 255,
  })
  semanticType: string | null;

  @Column("boolean", { name: "active", default: () => "true" })
  active: boolean;

  @Column("text", { name: "description", nullable: true })
  description: string | null;

  @Column("boolean", { name: "preview_display", default: () => "true" })
  previewDisplay: boolean;

  @Column("integer", { name: "position", default: () => "0" })
  position: number;

  @Column("integer", { name: "table_id", unique: true })
  tableId: number;

  @Column("integer", { name: "parent_id", nullable: true, unique: true })
  parentId: number | null;

  @Column("character varying", {
    name: "display_name",
    nullable: true,
    length: 254,
  })
  displayName: string | null;

  @Column("character varying", {
    name: "visibility_type",
    length: 32,
    default: () => "'normal'",
  })
  visibilityType: string;

  @Column("integer", { name: "fk_target_field_id", nullable: true })
  fkTargetFieldId: number | null;

  @Column("timestamp with time zone", { name: "last_analyzed", nullable: true })
  lastAnalyzed: Date | null;

  @Column("text", { name: "points_of_interest", nullable: true })
  pointsOfInterest: string | null;

  @Column("text", { name: "caveats", nullable: true })
  caveats: string | null;

  @Column("text", { name: "fingerprint", nullable: true })
  fingerprint: string | null;

  @Column("integer", { name: "fingerprint_version", default: () => "0" })
  fingerprintVersion: number;

  @Column("text", { name: "database_type" })
  databaseType: string;

  @Column("text", { name: "has_field_values", nullable: true })
  hasFieldValues: string | null;

  @Column("text", { name: "settings", nullable: true })
  settings: string | null;

  @Column("integer", { name: "database_position", default: () => "0" })
  databasePosition: number;

  @Column("integer", { name: "custom_position", default: () => "0" })
  customPosition: number;

  @Column("character varying", {
    name: "effective_type",
    nullable: true,
    length: 255,
  })
  effectiveType: string | null;

  @Column("character varying", {
    name: "coercion_strategy",
    nullable: true,
    length: 255,
  })
  coercionStrategy: string | null;

  @Column("character varying", {
    name: "nfc_path",
    nullable: true,
    length: 254,
  })
  nfcPath: string | null;

  @OneToMany(() => Dimension, (dimension) => dimension.field)
  dimensions: Dimension[];

  @OneToMany(() => Dimension, (dimension) => dimension.humanReadableField)
  dimensions2: Dimension[];

  @ManyToOne(
    () => MetabaseField,
    (metabaseField) => metabaseField.metabaseFields,
    { onDelete: "CASCADE" }
  )
  @JoinColumn([{ name: "parent_id", referencedColumnName: "id" }])
  parent: MetabaseField;

  @OneToMany(() => MetabaseField, (metabaseField) => metabaseField.parent)
  metabaseFields: MetabaseField[];

  @ManyToOne(
    () => MetabaseTable,
    (metabaseTable) => metabaseTable.metabaseFields,
    { onDelete: "CASCADE" }
  )
  @JoinColumn([{ name: "table_id", referencedColumnName: "id" }])
  table: MetabaseTable;

  @OneToMany(
    () => MetabaseFieldvalues,
    (metabaseFieldvalues) => metabaseFieldvalues.field
  )
  metabaseFieldvalues: MetabaseFieldvalues[];

  @OneToMany(
    () => MetricImportantField,
    (metricImportantField) => metricImportantField.field
  )
  metricImportantFields: MetricImportantField[];
}
