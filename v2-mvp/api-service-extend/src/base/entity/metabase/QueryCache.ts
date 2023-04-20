import { Column, Entity, Index } from "typeorm";

@Index("query_cache_pkey", ["queryHash"], { unique: true })
@Index("idx_query_cache_updated_at", ["updatedAt"], {})
@Entity("query_cache", { schema: "public" })
export class QueryCache {
  @Column("bytea", { primary: true, name: "query_hash" })
  queryHash: Buffer;

  @Column("timestamp with time zone", { name: "updated_at" })
  updatedAt: Date;

  @Column("bytea", { name: "results" })
  results: Buffer;
}
