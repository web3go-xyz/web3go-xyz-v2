import { Column, Entity, Index, JoinColumn, OneToOne } from "typeorm";
import { QrtzTriggers } from "./QrtzTriggers";

@Index(
  "pk_qrtz_simple_triggers",
  ["schedName", "triggerGroup", "triggerName"],
  { unique: true }
)
@Entity("qrtz_simple_triggers", { schema: "public" })
export class QrtzSimpleTriggers {
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

  @Column("bigint", { name: "repeat_count" })
  repeatCount: string;

  @Column("bigint", { name: "repeat_interval" })
  repeatInterval: string;

  @Column("bigint", { name: "times_triggered" })
  timesTriggered: string;

  @OneToOne(
    () => QrtzTriggers,
    (qrtzTriggers) => qrtzTriggers.qrtzSimpleTriggers
  )
  @JoinColumn([
    { name: "sched_name", referencedColumnName: "schedName" },
    { name: "trigger_name", referencedColumnName: "triggerName" },
    { name: "trigger_group", referencedColumnName: "triggerGroup" },
  ])
  qrtzTriggers: QrtzTriggers;
}
