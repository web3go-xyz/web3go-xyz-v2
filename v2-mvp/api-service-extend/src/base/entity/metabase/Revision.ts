import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { CoreUser } from "./CoreUser";

@Index("revision_pkey", ["id"], { unique: true })
@Index("idx_revision_model_model_id", ["model", "modelId"], {})
@Entity("revision", { schema: "public" })
export class Revision {
  @PrimaryGeneratedColumn({ type: "integer", name: "id" })
  id: number;

  @Column("character varying", { name: "model", length: 16 })
  model: string;

  @Column("integer", { name: "model_id" })
  modelId: number;

  @Column("timestamp with time zone", { name: "timestamp" })
  timestamp: Date;

  @Column("text", { name: "object" })
  object: string;

  @Column("boolean", { name: "is_reversion", default: () => "false" })
  isReversion: boolean;

  @Column("boolean", { name: "is_creation", default: () => "false" })
  isCreation: boolean;

  @Column("text", { name: "message", nullable: true })
  message: string | null;

  @ManyToOne(() => CoreUser, (coreUser) => coreUser.revisions, {
    onDelete: "CASCADE",
  })
  @JoinColumn([{ name: "user_id", referencedColumnName: "id" }])
  user: CoreUser;
}
