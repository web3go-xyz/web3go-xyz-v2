import { Column, Entity, Index } from "typeorm";

@Index("pk_qrtz_scheduler_state", ["instanceName", "schedName"], {
  unique: true,
})
@Entity("qrtz_scheduler_state", { schema: "public" })
export class QrtzSchedulerState {
  @Column("character varying", {
    primary: true,
    name: "sched_name",
    length: 120,
  })
  schedName: string;

  @Column("character varying", {
    primary: true,
    name: "instance_name",
    length: 200,
  })
  instanceName: string;

  @Column("bigint", { name: "last_checkin_time" })
  lastCheckinTime: string;

  @Column("bigint", { name: "checkin_interval" })
  checkinInterval: string;
}
