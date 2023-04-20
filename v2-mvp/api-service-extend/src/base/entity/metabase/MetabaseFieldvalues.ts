import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { MetabaseField } from "./MetabaseField";

@Index("idx_fieldvalues_field_id", ["fieldId"], {})
@Index("metabase_fieldvalues_pkey", ["id"], { unique: true })
@Entity("metabase_fieldvalues", { schema: "public" })
export class MetabaseFieldvalues {
  @PrimaryGeneratedColumn({ type: "integer", name: "id" })
  id: number;

  @Column("timestamp with time zone", { name: "created_at" })
  createdAt: Date;

  @Column("timestamp with time zone", { name: "updated_at" })
  updatedAt: Date;

  @Column("text", { name: "values", nullable: true })
  values: string | null;

  @Column("text", { name: "human_readable_values", nullable: true })
  humanReadableValues: string | null;

  @Column("integer", { name: "field_id" })
  fieldId: number;

  @Column("boolean", {
    name: "has_more_values",
    nullable: true,
    default: () => "false",
  })
  hasMoreValues: boolean | null;

  @Column("character varying", {
    name: "type",
    length: 32,
    default: () => "'full'",
  })
  type: string;

  @Column("text", { name: "hash_key", nullable: true })
  hashKey: string | null;

  @ManyToOne(
    () => MetabaseField,
    (metabaseField) => metabaseField.metabaseFieldvalues,
    { onDelete: "CASCADE" }
  )
  @JoinColumn([{ name: "field_id", referencedColumnName: "id" }])
  field: MetabaseField;
}
