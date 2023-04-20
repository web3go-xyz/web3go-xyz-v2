import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
} from "typeorm";
import { CoreUser } from "./CoreUser";
import { LoginHistory } from "./LoginHistory";

@Index("core_session_pkey", ["id"], { unique: true })
@Entity("core_session", { schema: "public" })
export class CoreSession {
  @Column("character varying", { primary: true, name: "id", length: 254 })
  id: string;

  @Column("timestamp with time zone", { name: "created_at" })
  createdAt: Date;

  @Column("text", { name: "anti_csrf_token", nullable: true })
  antiCsrfToken: string | null;

  @ManyToOne(() => CoreUser, (coreUser) => coreUser.coreSessions, {
    onDelete: "CASCADE",
  })
  @JoinColumn([{ name: "user_id", referencedColumnName: "id" }])
  user: CoreUser;

  @OneToMany(() => LoginHistory, (loginHistory) => loginHistory.session)
  loginHistories: LoginHistory[];
}
