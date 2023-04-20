import { Column, Entity, Index } from "typeorm";

@Index("data_migrations_pkey", ["id"], { unique: true })
@Index("idx_data_migrations_id", ["id"], {})
@Entity("data_migrations", { schema: "public" })
export class DataMigrations {
  @Column("character varying", { primary: true, name: "id", length: 254 })
  id: string;

  @Column("timestamp without time zone", { name: "timestamp" })
  timestamp: Date;
}
