import { Entity, Column, PrimaryColumn, Index, PrimaryGeneratedColumn } from 'typeorm';

@Entity('dashboard_dataset_relation', { schema: 'public' })
export class DashboardDatasetRelation {
  @PrimaryGeneratedColumn({
    type: "bigint",
    name: "id",
})
  id: number;

  @Column({ type: 'bigint', name: 'dashboard_id' })
  dashboardId: number;

  @Column({ type: 'bigint', name: 'report_card_id' })
  reportCardId: number;

  @Column({ type: 'bigint', name: 'source_report_card_id' })
  sourceReportCardId: number;

  @Column("boolean", { name: "dataset", default: () => "false" })
  dataset: boolean;

}
