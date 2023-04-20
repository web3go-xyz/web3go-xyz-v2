import { Column, Entity, Index, JoinColumn, OneToOne } from "typeorm";
import { QrtzTriggers } from "./QrtzTriggers";

@Index("pk_qrtz_blob_triggers", ["schedName", "triggerGroup", "triggerName"], {
  unique: true,
})
@Entity("qrtz_blob_triggers", { schema: "public" })
export class QrtzBlobTriggers {
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

  @Column("bytea", { name: "blob_data", nullable: true })
  blobData: Buffer | null;

  @OneToOne(() => QrtzTriggers, (qrtzTriggers) => qrtzTriggers.qrtzBlobTriggers)
  @JoinColumn([
    { name: "sched_name", referencedColumnName: "schedName" },
    { name: "trigger_name", referencedColumnName: "triggerName" },
    { name: "trigger_group", referencedColumnName: "triggerGroup" },
  ])
  qrtzTriggers: QrtzTriggers;
}
