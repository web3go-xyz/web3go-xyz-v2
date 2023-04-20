import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToOne,
} from "typeorm";
import { QrtzBlobTriggers } from "./QrtzBlobTriggers";
import { QrtzCronTriggers } from "./QrtzCronTriggers";
import { QrtzSimpleTriggers } from "./QrtzSimpleTriggers";
import { QrtzSimpropTriggers } from "./QrtzSimpropTriggers";
import { QrtzJobDetails } from "./QrtzJobDetails";

@Index("idx_qrtz_t_c", ["calendarName", "schedName"], {})
@Index("idx_qrtz_t_j", ["jobGroup", "jobName", "schedName"], {})
@Index("idx_qrtz_t_jg", ["jobGroup", "schedName"], {})
@Index(
  "idx_qrtz_t_nft_st_misfire",
  ["misfireInstr", "nextFireTime", "schedName", "triggerState"],
  {}
)
@Index(
  "idx_qrtz_t_nft_misfire",
  ["misfireInstr", "nextFireTime", "schedName"],
  {}
)
@Index(
  "idx_qrtz_t_nft_st_misfire_grp",
  ["misfireInstr", "nextFireTime", "schedName", "triggerGroup", "triggerState"],
  {}
)
@Index("idx_qrtz_t_next_fire_time", ["nextFireTime", "schedName"], {})
@Index("idx_qrtz_t_nft_st", ["nextFireTime", "schedName", "triggerState"], {})
@Index(
  "idx_qrtz_t_n_state",
  ["schedName", "triggerGroup", "triggerName", "triggerState"],
  {}
)
@Index("pk_qrtz_triggers", ["schedName", "triggerGroup", "triggerName"], {
  unique: true,
})
@Index(
  "idx_qrtz_t_n_g_state",
  ["schedName", "triggerGroup", "triggerState"],
  {}
)
@Index("idx_qrtz_t_g", ["schedName", "triggerGroup"], {})
@Index("idx_qrtz_t_state", ["schedName", "triggerState"], {})
@Entity("qrtz_triggers", { schema: "public" })
export class QrtzTriggers {
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

  @Column("character varying", { name: "job_name", length: 200 })
  jobName: string;

  @Column("character varying", { name: "job_group", length: 200 })
  jobGroup: string;

  @Column("character varying", {
    name: "description",
    nullable: true,
    length: 250,
  })
  description: string | null;

  @Column("bigint", { name: "next_fire_time", nullable: true })
  nextFireTime: string | null;

  @Column("bigint", { name: "prev_fire_time", nullable: true })
  prevFireTime: string | null;

  @Column("integer", { name: "priority", nullable: true })
  priority: number | null;

  @Column("character varying", { name: "trigger_state", length: 16 })
  triggerState: string;

  @Column("character varying", { name: "trigger_type", length: 8 })
  triggerType: string;

  @Column("bigint", { name: "start_time" })
  startTime: string;

  @Column("bigint", { name: "end_time", nullable: true })
  endTime: string | null;

  @Column("character varying", {
    name: "calendar_name",
    nullable: true,
    length: 200,
  })
  calendarName: string | null;

  @Column("smallint", { name: "misfire_instr", nullable: true })
  misfireInstr: number | null;

  @Column("bytea", { name: "job_data", nullable: true })
  jobData: Buffer | null;

  @OneToOne(
    () => QrtzBlobTriggers,
    (qrtzBlobTriggers) => qrtzBlobTriggers.qrtzTriggers
  )
  qrtzBlobTriggers: QrtzBlobTriggers;

  @OneToOne(
    () => QrtzCronTriggers,
    (qrtzCronTriggers) => qrtzCronTriggers.qrtzTriggers
  )
  qrtzCronTriggers: QrtzCronTriggers;

  @OneToOne(
    () => QrtzSimpleTriggers,
    (qrtzSimpleTriggers) => qrtzSimpleTriggers.qrtzTriggers
  )
  qrtzSimpleTriggers: QrtzSimpleTriggers;

  @OneToOne(
    () => QrtzSimpropTriggers,
    (qrtzSimpropTriggers) => qrtzSimpropTriggers.qrtzTriggers
  )
  qrtzSimpropTriggers: QrtzSimpropTriggers;

  @ManyToOne(
    () => QrtzJobDetails,
    (qrtzJobDetails) => qrtzJobDetails.qrtzTriggers
  )
  @JoinColumn([
    { name: "sched_name", referencedColumnName: "schedName" },
    { name: "job_name", referencedColumnName: "jobName" },
    { name: "job_group", referencedColumnName: "jobGroup" },
  ])
  qrtzJobDetails: QrtzJobDetails;
}
