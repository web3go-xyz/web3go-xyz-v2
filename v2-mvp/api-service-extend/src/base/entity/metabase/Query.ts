import { Column, Entity, Index } from "typeorm";

@Index("query_pkey", ["queryHash"], { unique: true })
@Entity("query", { schema: "public" })
export class Query {
  @Column("bytea", { primary: true, name: "query_hash" })
  queryHash: Buffer;

  @Column("integer", { name: "average_execution_time" })
  averageExecutionTime: number;

  @Column("text", { name: "query", nullable: true })
  query: string | null;
}
