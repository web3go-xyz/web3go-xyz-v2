import { Column, Entity, Index } from "typeorm";

@Index("pk_qrtz_fired_triggers", ["entryId", "schedName"], { unique: true })
@Index("idx_qrtz_ft_trig_inst_name", ["instanceName", "schedName"], {})
@Index(
  "idx_qrtz_ft_inst_job_req_rcvry",
  ["instanceName", "requestsRecovery", "schedName"],
  {}
)
@Index("idx_qrtz_ft_j_g", ["jobGroup", "jobName", "schedName"], {})
@Index("idx_qrtz_ft_jg", ["jobGroup", "schedName"], {})
@Index("idx_qrtz_ft_tg", ["schedName", "triggerGroup"], {})
@Index("idx_qrtz_ft_t_g", ["schedName", "triggerGroup", "triggerName"], {})
@Entity("qrtz_fired_triggers", { schema: "public" })
export class QrtzFiredTriggers {
  @Column("character varying", {
    primary: true,
    name: "sched_name",
    length: 120,
  })
  schedName: string;

  @Column("character varying", { primary: true, name: "entry_id", length: 95 })
  entryId: string;

  @Column("character varying", { name: "trigger_name", length: 200 })
  triggerName: string;

  @Column("character varying", { name: "trigger_group", length: 200 })
  triggerGroup: string;

  @Column("character varying", { name: "instance_name", length: 200 })
  instanceName: string;

  @Column("bigint", { name: "fired_time" })
  firedTime: string;

  @Column("bigint", { name: "sched_time", nullable: true })
  schedTime: string | null;

  @Column("integer", { name: "priority" })
  priority: number;

  @Column("character varying", { name: "state", length: 16 })
  state: string;

  @Column("character varying", {
    name: "job_name",
    nullable: true,
    length: 200,
  })
  jobName: string | null;

  @Column("character varying", {
    name: "job_group",
    nullable: true,
    length: 200,
  })
  jobGroup: string | null;

  @Column("boolean", { name: "is_nonconcurrent", nullable: true })
  isNonconcurrent: boolean | null;

  @Column("boolean", { name: "requests_recovery", nullable: true })
  requestsRecovery: boolean | null;
}
