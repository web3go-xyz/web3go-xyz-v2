import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { MetabaseField } from "./MetabaseField";

@Index("dimension_entity_id_key", ["entityId"], { unique: true })
@Index("idx_dimension_field_id", ["fieldId"], {})
@Index("unique_dimension_field_id_name", ["fieldId", "name"], { unique: true })
@Index("dimension_pkey", ["id"], { unique: true })
@Entity("dimension", { schema: "public" })
export class Dimension {
  @PrimaryGeneratedColumn({ type: "integer", name: "id" })
  id: number;

  @Column("integer", { name: "field_id", unique: true })
  fieldId: number;

  @Column("character varying", { name: "name", unique: true, length: 254 })
  name: string;

  @Column("character varying", { name: "type", length: 254 })
  type: string;

  @Column("timestamp without time zone", { name: "created_at" })
  createdAt: Date;

  @Column("timestamp without time zone", { name: "updated_at" })
  updatedAt: Date;

  @Column("character", {
    name: "entity_id",
    nullable: true,
    unique: true,
    length: 21,
  })
  entityId: string | null;

  @ManyToOne(() => MetabaseField, (metabaseField) => metabaseField.dimensions, {
    onDelete: "CASCADE",
  })
  @JoinColumn([{ name: "field_id", referencedColumnName: "id" }])
  field: MetabaseField;

  @ManyToOne(
    () => MetabaseField,
    (metabaseField) => metabaseField.dimensions2,
    { onDelete: "CASCADE" }
  )
  @JoinColumn([{ name: "human_readable_field_id", referencedColumnName: "id" }])
  humanReadableField: MetabaseField;
}
