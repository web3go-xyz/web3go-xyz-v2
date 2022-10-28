import { Column, Entity, Index } from "typeorm";

@Index("pk_qrtz_calendars", ["calendarName", "schedName"], { unique: true })
@Entity("qrtz_calendars", { schema: "public" })
export class QrtzCalendars {
  @Column("character varying", {
    primary: true,
    name: "sched_name",
    length: 120,
  })
  schedName: string;

  @Column("character varying", {
    primary: true,
    name: "calendar_name",
    length: 200,
  })
  calendarName: string;

  @Column("bytea", { name: "calendar" })
  calendar: Buffer;
}
