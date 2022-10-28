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
import { MetabaseTable } from "./MetabaseTable";
import { PersistedInfo } from "./PersistedInfo";
import { ReportCard } from "./ReportCard";

@Index("metabase_database_pkey", ["id"], { unique: true })
@Entity("metabase_database", { schema: "public" })
export class MetabaseDatabase {
  @PrimaryGeneratedColumn({ type: "integer", name: "id" })
  id: number;

  @Column("timestamp with time zone", { name: "created_at" })
  createdAt: Date;

  @Column("timestamp with time zone", { name: "updated_at" })
  updatedAt: Date;

  @Column("character varying", { name: "name", length: 254 })
  name: string;

  @Column("text", { name: "description", nullable: true })
  description: string | null;

  @Column("text", { name: "details", nullable: true })
  details: string | null;

  @Column("character varying", { name: "engine", length: 254 })
  engine: string;

  @Column("boolean", { name: "is_sample", default: () => "false" })
  isSample: boolean;

  @Column("boolean", { name: "is_full_sync", default: () => "true" })
  isFullSync: boolean;

  @Column("text", { name: "points_of_interest", nullable: true })
  pointsOfInterest: string | null;

  @Column("text", { name: "caveats", nullable: true })
  caveats: string | null;

  @Column("character varying", {
    name: "metadata_sync_schedule",
    length: 254,
    default: () => "'0 50 * * * ? *'",
  })
  metadataSyncSchedule: string;

  @Column("character varying", {
    name: "cache_field_values_schedule",
    length: 254,
    default: () => "'0 50 0 * * ? *'",
  })
  cacheFieldValuesSchedule: string;

  @Column("character varying", {
    name: "timezone",
    nullable: true,
    length: 254,
  })
  timezone: string | null;

  @Column("boolean", { name: "is_on_demand", default: () => "false" })
  isOnDemand: boolean;

  @Column("text", { name: "options", nullable: true })
  options: string | null;

  @Column("boolean", { name: "auto_run_queries", default: () => "true" })
  autoRunQueries: boolean;

  @Column("boolean", { name: "refingerprint", nullable: true })
  refingerprint: boolean | null;

  @Column("integer", { name: "cache_ttl", nullable: true })
  cacheTtl: number | null;

  @Column("character varying", {
    name: "initial_sync_status",
    length: 32,
    default: () => "'complete'",
  })
  initialSyncStatus: string;

  @Column("text", { name: "settings", nullable: true })
  settings: string | null;

  @ManyToOne(() => CoreUser, (coreUser) => coreUser.metabaseDatabases, {
    onDelete: "SET NULL",
  })
  @JoinColumn([{ name: "creator_id", referencedColumnName: "id" }])
  creator: CoreUser;

  @OneToMany(() => MetabaseTable, (metabaseTable) => metabaseTable.db)
  metabaseTables: MetabaseTable[];

  @OneToMany(() => PersistedInfo, (persistedInfo) => persistedInfo.database)
  persistedInfos: PersistedInfo[];

  @OneToMany(() => ReportCard, (reportCard) => reportCard.database)
  reportCards: ReportCard[];
}
