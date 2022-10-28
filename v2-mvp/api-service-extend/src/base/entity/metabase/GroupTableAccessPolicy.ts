import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { ReportCard } from "./ReportCard";
import { PermissionsGroup } from "./PermissionsGroup";
import { MetabaseTable } from "./MetabaseTable";

@Index("idx_gtap_table_id_group_id", ["groupId", "tableId"], {})
@Index("unique_gtap_table_id_group_id", ["groupId", "tableId"], {
  unique: true,
})
@Index("group_table_access_policy_pkey", ["id"], { unique: true })
@Entity("group_table_access_policy", { schema: "public" })
export class GroupTableAccessPolicy {
  @PrimaryGeneratedColumn({ type: "integer", name: "id" })
  id: number;

  @Column("integer", { name: "group_id", unique: true })
  groupId: number;

  @Column("integer", { name: "table_id", unique: true })
  tableId: number;

  @Column("text", { name: "attribute_remappings", nullable: true })
  attributeRemappings: string | null;

  @ManyToOne(
    () => ReportCard,
    (reportCard) => reportCard.groupTableAccessPolicies,
    { onDelete: "CASCADE" }
  )
  @JoinColumn([{ name: "card_id", referencedColumnName: "id" }])
  card: ReportCard;

  @ManyToOne(
    () => PermissionsGroup,
    (permissionsGroup) => permissionsGroup.groupTableAccessPolicies,
    { onDelete: "CASCADE" }
  )
  @JoinColumn([{ name: "group_id", referencedColumnName: "id" }])
  group: PermissionsGroup;

  @ManyToOne(
    () => MetabaseTable,
    (metabaseTable) => metabaseTable.groupTableAccessPolicies,
    { onDelete: "CASCADE" }
  )
  @JoinColumn([{ name: "table_id", referencedColumnName: "id" }])
  table: MetabaseTable;
}
