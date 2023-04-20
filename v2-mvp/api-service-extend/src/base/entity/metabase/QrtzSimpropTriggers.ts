import { Column, Entity, Index, JoinColumn, OneToOne } from "typeorm";
import { QrtzTriggers } from "./QrtzTriggers";

@Index(
  "pk_qrtz_simprop_triggers",
  ["schedName", "triggerGroup", "triggerName"],
  { unique: true }
)
@Entity("qrtz_simprop_triggers", { schema: "public" })
export class QrtzSimpropTriggers {
  @Column("character varying", {
    primary: true,
    name: "sched_name",
    length: 120,
  })
  schedName: string;

  @Column("character varying", {
    primary: true,
    name: "trigger_name",
    length: 200,
  })
  triggerName: string;

  @Column("character varying", {
    primary: true,
    name: "trigger_group",
    length: 200,
  })
  triggerGroup: string;

  @Column("character varying", {
    name: "str_prop_1",
    nullable: true,
    length: 512,
  })
  strProp_1: string | null;

  @Column("character varying", {
    name: "str_prop_2",
    nullable: true,
    length: 512,
  })
  strProp_2: string | null;

  @Column("character varying", {
    name: "str_prop_3",
    nullable: true,
    length: 512,
  })
  strProp_3: string | null;

  @Column("integer", { name: "int_prop_1", nullable: true })
  intProp_1: number | null;

  @Column("integer", { name: "int_prop_2", nullable: true })
  intProp_2: number | null;

  @Column("bigint", { name: "long_prop_1", nullable: true })
  longProp_1: string | null;

  @Column("bigint", { name: "long_prop_2", nullable: true })
  longProp_2: string | null;

  @Column("numeric", {
    name: "dec_prop_1",
    nullable: true,
    precision: 13,
    scale: 4,
  })
  decProp_1: string | null;

  @Column("numeric", {
    name: "dec_prop_2",
    nullable: true,
    precision: 13,
    scale: 4,
  })
  decProp_2: string | null;

  @Column("boolean", { name: "bool_prop_1", nullable: true })
  boolProp_1: boolean | null;

  @Column("boolean", { name: "bool_prop_2", nullable: true })
  boolProp_2: boolean | null;

  @OneToOne(
    () => QrtzTriggers,
    (qrtzTriggers) => qrtzTriggers.qrtzSimpropTriggers
  )
  @JoinColumn([
    { name: "sched_name", referencedColumnName: "schedName" },
    { name: "trigger_name", referencedColumnName: "triggerName" },
    { name: "trigger_group", referencedColumnName: "triggerGroup" },
  ])
  qrtzTriggers: QrtzTriggers;
}
