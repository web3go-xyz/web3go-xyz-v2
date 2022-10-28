import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { ComputationJob } from "./ComputationJob";

@Index("computation_job_result_pkey", ["id"], { unique: true })
@Entity("computation_job_result", { schema: "public" })
export class ComputationJobResult {
  @PrimaryGeneratedColumn({ type: "integer", name: "id" })
  id: number;

  @Column("timestamp without time zone", { name: "created_at" })
  createdAt: Date;

  @Column("timestamp without time zone", { name: "updated_at" })
  updatedAt: Date;

  @Column("character varying", { name: "permanence", length: 254 })
  permanence: string;

  @Column("text", { name: "payload" })
  payload: string;

  @ManyToOne(
    () => ComputationJob,
    (computationJob) => computationJob.computationJobResults,
    { onDelete: "CASCADE" }
  )
  @JoinColumn([{ name: "job_id", referencedColumnName: "id" }])
  job: ComputationJob;
}
