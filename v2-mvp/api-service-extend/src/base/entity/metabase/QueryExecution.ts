import { Column, Entity, Index, PrimaryGeneratedColumn } from "typeorm";

@Index("idx_query_execution_card_id", ["cardId"], {})
@Index("idx_query_execution_card_id_started_at", ["cardId", "startedAt"], {})
@Index("idx_query_execution_query_hash_started_at", ["hash", "startedAt"], {})
@Index("query_execution_pkey", ["id"], { unique: true })
@Index("idx_query_execution_started_at", ["startedAt"], {})
@Entity("query_execution", { schema: "public" })
export class QueryExecution {
  @PrimaryGeneratedColumn({ type: "integer", name: "id" })
  id: number;

  @Column("bytea", { name: "hash" })
  hash: Buffer;

  @Column("timestamp with time zone", { name: "started_at" })
  startedAt: Date;

  @Column("integer", { name: "running_time" })
  runningTime: number;

  @Column("integer", { name: "result_rows" })
  resultRows: number;

  @Column("boolean", { name: "native" })
  native: boolean;

  @Column("character varying", { name: "context", nullable: true, length: 32 })
  context: string | null;

  @Column("text", { name: "error", nullable: true })
  error: string | null;

  @Column("integer", { name: "executor_id", nullable: true })
  executorId: number | null;

  @Column("integer", { name: "card_id", nullable: true })
  cardId: number | null;

  @Column("integer", { name: "dashboard_id", nullable: true })
  dashboardId: number | null;

  @Column("integer", { name: "pulse_id", nullable: true })
  pulseId: number | null;

  @Column("integer", { name: "database_id", nullable: true })
  databaseId: number | null;

  @Column("boolean", { name: "cache_hit", nullable: true })
  cacheHit: boolean | null;
}
