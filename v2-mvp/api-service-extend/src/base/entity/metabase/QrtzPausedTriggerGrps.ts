import { Column, Entity, Index } from "typeorm";

@Index("pk_sched_name", ["schedName", "triggerGroup"], { unique: true })
@Entity("qrtz_paused_trigger_grps", { schema: "public" })
export class QrtzPausedTriggerGrps {
  @Column("character varying", {
    primary: true,
    name: "sched_name",
    length: 120,
  })
  schedName: string;

  @Column("character varying", {
    primary: true,
    name: "trigger_group",
    length: 200,
  })
  triggerGroup: string;
}
