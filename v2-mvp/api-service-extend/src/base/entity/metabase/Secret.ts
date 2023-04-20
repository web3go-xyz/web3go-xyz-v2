import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { CoreUser } from "./CoreUser";

@Index("secret_pkey", ["id", "version"], { unique: true })
@Entity("secret", { schema: "public" })
export class Secret {
  @PrimaryGeneratedColumn({ type: "integer", name: "id" })
  id: number;

  @Column("integer", { primary: true, name: "version", default: () => "1" })
  version: number;

  @Column("timestamp with time zone", { name: "created_at" })
  createdAt: Date;

  @Column("timestamp with time zone", { name: "updated_at", nullable: true })
  updatedAt: Date | null;

  @Column("character varying", { name: "name", length: 254 })
  name: string;

  @Column("character varying", { name: "kind", length: 254 })
  kind: string;

  @Column("character varying", { name: "source", nullable: true, length: 254 })
  source: string | null;

  @Column("bytea", { name: "value" })
  value: Buffer;

  @ManyToOne(() => CoreUser, (coreUser) => coreUser.secrets)
  @JoinColumn([{ name: "creator_id", referencedColumnName: "id" }])
  creator: CoreUser;
}
