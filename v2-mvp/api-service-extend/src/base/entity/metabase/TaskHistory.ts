import { Column, Entity, Index, PrimaryGeneratedColumn } from "typeorm";

@Index("idx_task_history_db_id", ["dbId"], {})
@Index("idx_task_history_end_time", ["endedAt"], {})
@Index("task_history_pkey", ["id"], { unique: true })
@Entity("task_history", { schema: "public" })
export class TaskHistory {
  @PrimaryGeneratedColumn({ type: "integer", name: "id" })
  id: number;

  @Column("character varying", { name: "task", length: 254 })
  task: string;

  @Column("integer", { name: "db_id", nullable: true })
  dbId: number | null;

  @Column("timestamp with time zone", {
    name: "started_at",
    default: () => "CURRENT_TIMESTAMP",
  })
  startedAt: Date;

  @Column("timestamp with time zone", {
    name: "ended_at",
    default: () => "CURRENT_TIMESTAMP",
  })
  endedAt: Date;

  @Column("integer", { name: "duration" })
  duration: number;

  @Column("text", { name: "task_details", nullable: true })
  taskDetails: string | null;
}
