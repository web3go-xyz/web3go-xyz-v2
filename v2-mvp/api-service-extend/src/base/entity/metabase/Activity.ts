import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { CoreUser } from "./CoreUser";

@Index("idx_activity_custom_id", ["customId"], {})
@Index("activity_pkey", ["id"], { unique: true })
@Index("idx_activity_timestamp", ["timestamp"], {})
@Index("idx_activity_user_id", ["userId"], {})
@Entity("activity", { schema: "public" })
export class Activity {
  @PrimaryGeneratedColumn({ type: "integer", name: "id" })
  id: number;

  @Column("character varying", { name: "topic", length: 32 })
  topic: string;

  @Column("timestamp with time zone", { name: "timestamp" })
  timestamp: Date;

  @Column("integer", { name: "user_id", nullable: true })
  userId: number | null;

  @Column("character varying", { name: "model", nullable: true, length: 16 })
  model: string | null;

  @Column("integer", { name: "model_id", nullable: true })
  modelId: number | null;

  @Column("integer", { name: "database_id", nullable: true })
  databaseId: number | null;

  @Column("integer", { name: "table_id", nullable: true })
  tableId: number | null;

  @Column("character varying", {
    name: "custom_id",
    nullable: true,
    length: 48,
  })
  customId: string | null;

  @Column("text", { name: "details" })
  details: string;

  @ManyToOne(() => CoreUser, (coreUser) => coreUser.activities, {
    onDelete: "CASCADE",
  })
  @JoinColumn([{ name: "user_id", referencedColumnName: "id" }])
  user: CoreUser;
}
