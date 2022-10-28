import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { ReportCard } from "./ReportCard";
import { CoreUser } from "./CoreUser";
import { MetabaseDatabase } from "./MetabaseDatabase";

@Index("persisted_info_card_id_key", ["cardId"], { unique: true })
@Index("persisted_info_pkey", ["id"], { unique: true })
@Entity("persisted_info", { schema: "public" })
export class PersistedInfo {
  @PrimaryGeneratedColumn({ type: "integer", name: "id" })
  id: number;

  @Column("integer", { name: "card_id", unique: true })
  cardId: number;

  @Column("text", { name: "question_slug" })
  questionSlug: string;

  @Column("text", { name: "table_name" })
  tableName: string;

  @Column("text", { name: "definition", nullable: true })
  definition: string | null;

  @Column("text", { name: "query_hash", nullable: true })
  queryHash: string | null;

  @Column("boolean", { name: "active", default: () => "false" })
  active: boolean;

  @Column("text", { name: "state" })
  state: string;

  @Column("timestamp with time zone", { name: "refresh_begin" })
  refreshBegin: Date;

  @Column("timestamp with time zone", { name: "refresh_end", nullable: true })
  refreshEnd: Date | null;

  @Column("timestamp with time zone", {
    name: "state_change_at",
    nullable: true,
  })
  stateChangeAt: Date | null;

  @Column("text", { name: "error", nullable: true })
  error: string | null;

  @Column("timestamp with time zone", {
    name: "created_at",
    default: () => "now()",
  })
  createdAt: Date;

  @OneToOne(() => ReportCard, (reportCard) => reportCard.persistedInfo, {
    onDelete: "CASCADE",
  })
  @JoinColumn([{ name: "card_id", referencedColumnName: "id" }])
  card: ReportCard;

  @ManyToOne(() => CoreUser, (coreUser) => coreUser.persistedInfos)
  @JoinColumn([{ name: "creator_id", referencedColumnName: "id" }])
  creator: CoreUser;

  @ManyToOne(
    () => MetabaseDatabase,
    (metabaseDatabase) => metabaseDatabase.persistedInfos,
    { onDelete: "CASCADE" }
  )
  @JoinColumn([{ name: "database_id", referencedColumnName: "id" }])
  database: MetabaseDatabase;
}
