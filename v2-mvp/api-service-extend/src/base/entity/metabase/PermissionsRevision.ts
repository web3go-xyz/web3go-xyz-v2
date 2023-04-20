import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { CoreUser } from "./CoreUser";

@Index("permissions_revision_pkey", ["id"], { unique: true })
@Entity("permissions_revision", { schema: "public" })
export class PermissionsRevision {
  @PrimaryGeneratedColumn({ type: "integer", name: "id" })
  id: number;

  @Column("text", { name: "before" })
  before: string;

  @Column("text", { name: "after" })
  after: string;

  @Column("timestamp without time zone", { name: "created_at" })
  createdAt: Date;

  @Column("text", { name: "remark", nullable: true })
  remark: string | null;

  @ManyToOne(() => CoreUser, (coreUser) => coreUser.permissionsRevisions, {
    onDelete: "CASCADE",
  })
  @JoinColumn([{ name: "user_id", referencedColumnName: "id" }])
  user: CoreUser;
}
