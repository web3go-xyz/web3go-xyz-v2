import { Column, Entity, Index } from "typeorm";

@Index("pk_qrtz_locks", ["lockName", "schedName"], { unique: true })
@Entity("qrtz_locks", { schema: "public" })
export class QrtzLocks {
  @Column("character varying", {
    primary: true,
    name: "sched_name",
    length: 120,
  })
  schedName: string;

  @Column("character varying", { primary: true, name: "lock_name", length: 40 })
  lockName: string;
}
