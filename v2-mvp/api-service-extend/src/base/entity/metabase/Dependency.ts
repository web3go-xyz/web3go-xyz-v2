import { Column, Entity, Index, PrimaryGeneratedColumn } from "typeorm";

@Index("idx_dependency_dependent_on_id", ["dependentOnId"], {})
@Index("idx_dependency_dependent_on_model", ["dependentOnModel"], {})
@Index("dependency_pkey", ["id"], { unique: true })
@Index("idx_dependency_model", ["model"], {})
@Index("idx_dependency_model_id", ["modelId"], {})
@Entity("dependency", { schema: "public" })
export class Dependency {
  @PrimaryGeneratedColumn({ type: "integer", name: "id" })
  id: number;

  @Column("character varying", { name: "model", length: 32 })
  model: string;

  @Column("integer", { name: "model_id" })
  modelId: number;

  @Column("character varying", { name: "dependent_on_model", length: 32 })
  dependentOnModel: string;

  @Column("integer", { name: "dependent_on_id" })
  dependentOnId: number;

  @Column("timestamp with time zone", { name: "created_at" })
  createdAt: Date;
}
