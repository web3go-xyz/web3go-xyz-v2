import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { CardBookmark } from "./CardBookmark";
import { CardLabel } from "./CardLabel";
import { DashboardcardSeries } from "./DashboardcardSeries";
import { GroupTableAccessPolicy } from "./GroupTableAccessPolicy";
import { PersistedInfo } from "./PersistedInfo";
import { PulseCard } from "./PulseCard";
import { Collection } from "./Collection";
import { CoreUser } from "./CoreUser";
import { MetabaseDatabase } from "./MetabaseDatabase";
import { MetabaseTable } from "./MetabaseTable";
import { ReportCardfavorite } from "./ReportCardfavorite";
import { ReportDashboardcard } from "./ReportDashboardcard";

@Index("idx_card_collection_id", ["collectionId"], {})
@Index("idx_card_creator_id", ["creatorId"], {})
@Index("report_card_entity_id_key", ["entityId"], { unique: true })
@Index("report_card_pkey", ["id"], { unique: true })
@Index("report_card_public_uuid_key", ["publicUuid"], { unique: true })
@Index("idx_card_public_uuid", ["publicUuid"], {})
@Entity("report_card", { schema: "public" })
export class ReportCard {
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

  @Column("character varying", { name: "display", length: 254 })
  display: string;

  @Column("text", { name: "dataset_query" })
  datasetQuery: string;

  @Column("text", { name: "visualization_settings" })
  visualizationSettings: string;

  @Column("integer", { name: "creator_id" })
  creatorId: number;

  @Column("character varying", {
    name: "query_type",
    nullable: true,
    length: 16,
  })
  queryType: string | null;

  @Column("boolean", { name: "archived", default: () => "false" })
  archived: boolean;

  @Column("integer", { name: "collection_id", nullable: true })
  collectionId: number | null;

  @Column("character", {
    name: "public_uuid",
    nullable: true,
    unique: true,
    length: 36,
  })
  publicUuid: string | null;

  @Column("boolean", { name: "enable_embedding", default: () => "false" })
  enableEmbedding: boolean;

  @Column("text", { name: "embedding_params", nullable: true })
  embeddingParams: string | null;

  @Column("integer", { name: "cache_ttl", nullable: true })
  cacheTtl: number | null;

  @Column("text", { name: "result_metadata", nullable: true })
  resultMetadata: string | null;

  @Column("smallint", { name: "collection_position", nullable: true })
  collectionPosition: number | null;

  @Column("boolean", { name: "dataset", default: () => "false" })
  dataset: boolean;

  @Column("character", {
    name: "entity_id",
    nullable: true,
    unique: true,
    length: 21,
  })
  entityId: string | null;

  @Column("text", { name: "parameters", nullable: true })
  parameters: string | null;

  @Column("text", { name: "parameter_mappings", nullable: true })
  parameterMappings: string | null;

  @Column("boolean", { name: "collection_preview", default: () => "true" })
  collectionPreview: boolean;

  @OneToMany(() => CardBookmark, (cardBookmark) => cardBookmark.card)
  cardBookmarks: CardBookmark[];

  @OneToMany(() => CardLabel, (cardLabel) => cardLabel.card)
  cardLabels: CardLabel[];

  @OneToMany(
    () => DashboardcardSeries,
    (dashboardcardSeries) => dashboardcardSeries.card
  )
  dashboardcardSeries: DashboardcardSeries[];

  @OneToMany(
    () => GroupTableAccessPolicy,
    (groupTableAccessPolicy) => groupTableAccessPolicy.card
  )
  groupTableAccessPolicies: GroupTableAccessPolicy[];

  @OneToOne(() => PersistedInfo, (persistedInfo) => persistedInfo.card)
  persistedInfo: PersistedInfo;

  @OneToMany(() => PulseCard, (pulseCard) => pulseCard.card)
  pulseCards: PulseCard[];

  @ManyToOne(() => Collection, (collection) => collection.reportCards, {
    onDelete: "SET NULL",
  })
  @JoinColumn([{ name: "collection_id", referencedColumnName: "id" }])
  collection: Collection;

  @ManyToOne(() => CoreUser, (coreUser) => coreUser.reportCards, {
    onDelete: "CASCADE",
  })
  @JoinColumn([{ name: "creator_id", referencedColumnName: "id" }])
  creator: CoreUser;

  @ManyToOne(
    () => MetabaseDatabase,
    (metabaseDatabase) => metabaseDatabase.reportCards,
    { onDelete: "CASCADE" }
  )
  @JoinColumn([{ name: "database_id", referencedColumnName: "id" }])
  database: MetabaseDatabase;

  @ManyToOne(() => CoreUser, (coreUser) => coreUser.reportCards2, {
    onDelete: "CASCADE",
  })
  @JoinColumn([{ name: "made_public_by_id", referencedColumnName: "id" }])
  madePublicBy: CoreUser;

  @ManyToOne(
    () => MetabaseTable,
    (metabaseTable) => metabaseTable.reportCards,
    { onDelete: "CASCADE" }
  )
  @JoinColumn([{ name: "table_id", referencedColumnName: "id" }])
  table: MetabaseTable;

  @OneToMany(
    () => ReportCardfavorite,
    (reportCardfavorite) => reportCardfavorite.card
  )
  reportCardfavorites: ReportCardfavorite[];

  @OneToMany(
    () => ReportDashboardcard,
    (reportDashboardcard) => reportDashboardcard.card
  )
  reportDashboardcards: ReportDashboardcard[];
}
