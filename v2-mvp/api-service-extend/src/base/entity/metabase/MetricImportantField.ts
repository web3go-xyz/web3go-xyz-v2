import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { MetabaseField } from "./MetabaseField";
import { Metric } from "./Metric";

@Index(
  "unique_metric_important_field_metric_id_field_id",
  ["fieldId", "metricId"],
  { unique: true }
)
@Index("idx_metric_important_field_field_id", ["fieldId"], {})
@Index("metric_important_field_pkey", ["id"], { unique: true })
@Index("idx_metric_important_field_metric_id", ["metricId"], {})
@Entity("metric_important_field", { schema: "public" })
export class MetricImportantField {
  @PrimaryGeneratedColumn({ type: "integer", name: "id" })
  id: number;

  @Column("integer", { name: "metric_id", unique: true })
  metricId: number;

  @Column("integer", { name: "field_id", unique: true })
  fieldId: number;

  @ManyToOne(
    () => MetabaseField,
    (metabaseField) => metabaseField.metricImportantFields,
    { onDelete: "CASCADE" }
  )
  @JoinColumn([{ name: "field_id", referencedColumnName: "id" }])
  field: MetabaseField;

  @ManyToOne(() => Metric, (metric) => metric.metricImportantFields, {
    onDelete: "CASCADE",
  })
  @JoinColumn([{ name: "metric_id", referencedColumnName: "id" }])
  metric: Metric;
}
