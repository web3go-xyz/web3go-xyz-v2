import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { CoreUser } from "./CoreUser";
import { ComputationJobResult } from "./ComputationJobResult";

@Index("computation_job_pkey", ["id"], { unique: true })
@Entity("computation_job", { schema: "public" })
export class ComputationJob {
  @PrimaryGeneratedColumn({ type: "integer", name: "id" })
  id: number;

  @Column("timestamp without time zone", { name: "created_at" })
  createdAt: Date;

  @Column("timestamp without time zone", { name: "updated_at" })
  updatedAt: Date;

  @Column("character varying", { name: "type", length: 254 })
  type: string;

  @Column("character varying", { name: "status", length: 254 })
  status: string;

  @Column("text", { name: "context", nullable: true })
  context: string | null;

  @Column("timestamp without time zone", { name: "ended_at", nullable: true })
  endedAt: Date | null;

  @ManyToOne(() => CoreUser, (coreUser) => coreUser.computationJobs, {
    onDelete: "CASCADE",
  })
  @JoinColumn([{ name: "creator_id", referencedColumnName: "id" }])
  creator: CoreUser;

  @OneToMany(
    () => ComputationJobResult,
    (computationJobResult) => computationJobResult.job
  )
  computationJobResults: ComputationJobResult[];
}
