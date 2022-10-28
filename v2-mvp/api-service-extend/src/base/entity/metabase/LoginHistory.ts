import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { CoreSession } from "./CoreSession";
import { CoreUser } from "./CoreUser";

@Index("idx_user_id_device_id", ["deviceId", "sessionId"], {})
@Index("login_history_pkey", ["id"], { unique: true })
@Index("idx_session_id", ["sessionId"], {})
@Index("idx_user_id_timestamp", ["timestamp", "userId"], {})
@Index("idx_timestamp", ["timestamp"], {})
@Index("idx_user_id", ["userId"], {})
@Entity("login_history", { schema: "public" })
export class LoginHistory {
  @PrimaryGeneratedColumn({ type: "integer", name: "id" })
  id: number;

  @Column("timestamp with time zone", {
    name: "timestamp",
    default: () => "now()",
  })
  timestamp: Date;

  @Column("integer", { name: "user_id" })
  userId: number;

  @Column("character varying", {
    name: "session_id",
    nullable: true,
    length: 254,
  })
  sessionId: string | null;

  @Column("character", { name: "device_id", length: 36 })
  deviceId: string;

  @Column("text", { name: "device_description" })
  deviceDescription: string;

  @Column("text", { name: "ip_address" })
  ipAddress: string;

  @ManyToOne(() => CoreSession, (coreSession) => coreSession.loginHistories, {
    onDelete: "SET NULL",
  })
  @JoinColumn([{ name: "session_id", referencedColumnName: "id" }])
  session: CoreSession;

  @ManyToOne(() => CoreUser, (coreUser) => coreUser.loginHistories, {
    onDelete: "CASCADE",
  })
  @JoinColumn([{ name: "user_id", referencedColumnName: "id" }])
  user: CoreUser;
}
