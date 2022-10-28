import { Column, Entity, Index, OneToMany } from "typeorm";
import { QrtzTriggers } from "./QrtzTriggers";

@Index("idx_qrtz_j_grp", ["jobGroup", "schedName"], {})
@Index("pk_qrtz_job_details", ["jobGroup", "jobName", "schedName"], {
  unique: true,
})
@Index("idx_qrtz_j_req_recovery", ["requestsRecovery", "schedName"], {})
@Entity("qrtz_job_details", { schema: "public" })
export class QrtzJobDetails {
  @Column("character varying", {
    primary: true,
    name: "sched_name",
    length: 120,
  })
  schedName: string;

  @Column("character varying", { primary: true, name: "job_name", length: 200 })
  jobName: string;

  @Column("character varying", {
    primary: true,
    name: "job_group",
    length: 200,
  })
  jobGroup: string;

  @Column("character varying", {
    name: "description",
    nullable: true,
    length: 250,
  })
  description: string | null;

  @Column("character varying", { name: "job_class_name", length: 250 })
  jobClassName: string;

  @Column("boolean", { name: "is_durable" })
  isDurable: boolean;

  @Column("boolean", { name: "is_nonconcurrent" })
  isNonconcurrent: boolean;

  @Column("boolean", { name: "is_update_data" })
  isUpdateData: boolean;

  @Column("boolean", { name: "requests_recovery" })
  requestsRecovery: boolean;

  @Column("bytea", { name: "job_data", nullable: true })
  jobData: Buffer | null;

  @OneToMany(() => QrtzTriggers, (qrtzTriggers) => qrtzTriggers.qrtzJobDetails)
  qrtzTriggers: QrtzTriggers[];
}
