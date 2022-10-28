import { Column, Entity, Index, JoinColumn, OneToOne } from "typeorm";
import { QrtzTriggers } from "./QrtzTriggers";

@Index("pk_qrtz_cron_triggers", ["schedName", "triggerGroup", "triggerName"], {
  unique: true,
})
@Entity("qrtz_cron_triggers", { schema: "public" })
export class QrtzCronTriggers {
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

  @Column("character varying", { name: "cron_expression", length: 120 })
  cronExpression: string;

  @Column("character varying", {
    name: "time_zone_id",
    nullable: true,
    length: 80,
  })
  timeZoneId: string | null;

  @OneToOne(() => QrtzTriggers, (qrtzTriggers) => qrtzTriggers.qrtzCronTriggers)
  @JoinColumn([
    { name: "sched_name", referencedColumnName: "schedName" },
    { name: "trigger_name", referencedColumnName: "triggerName" },
    { name: "trigger_group", referencedColumnName: "triggerGroup" },
  ])
  qrtzTriggers: QrtzTriggers;
}
