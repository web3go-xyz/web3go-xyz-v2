import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { CoreUser } from "./CoreUser";

@Index("view_log_pkey", ["id"], { unique: true })
@Index("idx_view_log_timestamp", ["modelId"], {})
@Index("idx_view_log_user_id", ["userId"], {})
@Entity("view_log", { schema: "public" })
export class ViewLog {
  @PrimaryGeneratedColumn({ type: "integer", name: "id" })
  id: number;

  @Column("integer", { name: "user_id", nullable: true })
  userId: number | null;

  @Column("character varying", { name: "model", length: 16 })
  model: string;

  @Column("integer", { name: "model_id" })
  modelId: number;

  @Column("timestamp with time zone", { name: "timestamp" })
  timestamp: Date;

  @Column("text", { name: "metadata", nullable: true })
  metadata: string | null;

  @ManyToOne(() => CoreUser, (coreUser) => coreUser.viewLogs, {
    onDelete: "CASCADE",
  })
  @JoinColumn([{ name: "user_id", referencedColumnName: "id" }])
  user: CoreUser;
}
