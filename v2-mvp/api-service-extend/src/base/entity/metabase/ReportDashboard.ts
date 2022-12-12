import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { DashboardBookmark } from "./DashboardBookmark";
import { DashboardFavorite } from "./DashboardFavorite";
import { Pulse } from "./Pulse";
import { Collection } from "./Collection";
import { CoreUser } from "./CoreUser";
import { ReportDashboardcard } from "./ReportDashboardcard";

@Index("idx_dashboard_collection_id", ["collectionId"], {})
@Index("idx_dashboard_creator_id", ["creatorId"], {})
@Index("report_dashboard_entity_id_key", ["entityId"], { unique: true })
@Index("report_dashboard_pkey", ["id"], { unique: true })
@Index("report_dashboard_public_uuid_key", ["publicUuid"], { unique: true })
@Index("idx_dashboard_public_uuid", ["publicUuid"], {})
@Index(
  "idx_report_dashboard_show_in_getting_started",
  ["showInGettingStarted"],
  {}
)
@Entity("report_dashboard", { schema: "public" })
export class ReportDashboard {
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

  @Column("integer", { name: "creator_id" })
  creatorId: number;

  @Column("text", { name: "parameters" })
  parameters: string;

  @Column("text", { name: "points_of_interest", nullable: true })
  pointsOfInterest: string | null;

  @Column("text", { name: "caveats", nullable: true })
  caveats: string | null;

  @Column("boolean", {
    name: "show_in_getting_started",
    default: () => "false",
  })
  showInGettingStarted: boolean;

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

  @Column("boolean", { name: "archived", default: () => "false" })
  archived: boolean;

  @Column("integer", { name: "position", nullable: true })
  position: number | null;

  @Column("integer", { name: "collection_id", nullable: true })
  collectionId: number | null;

  @Column("smallint", { name: "collection_position", nullable: true })
  collectionPosition: number | null;

  @Column("integer", { name: "cache_ttl", nullable: true })
  cacheTtl: number | null;

  @Column("character", {
    name: "entity_id",
    nullable: true,
    unique: true,
    length: 21,
  })
  entityId: string | null;

  @OneToMany(
    () => DashboardBookmark,
    (dashboardBookmark) => dashboardBookmark.dashboard
  )
  dashboardBookmarks: DashboardBookmark[];

  @OneToMany(
    () => DashboardFavorite,
    (dashboardFavorite) => dashboardFavorite.dashboard
  )
  dashboardFavorites: DashboardFavorite[];

  @OneToMany(() => Pulse, (pulse) => pulse.dashboard)
  pulses: Pulse[];

  // @ManyToOne(() => Collection, (collection) => collection.reportDashboards, {
  //   onDelete: "SET NULL",
  // })
  // @JoinColumn([{ name: "collection_id", referencedColumnName: "id" }])
  // collection: Collection;

  // @ManyToOne(() => CoreUser, (coreUser) => coreUser.reportDashboards, {
  //   onDelete: "CASCADE",
  // })
  // @JoinColumn([{ name: "creator_id", referencedColumnName: "id" }])
  // creator: CoreUser;

  @Column("integer", { name: "made_public_by_id", nullable: true })
  made_public_by_id: CoreUser;

  @OneToMany(
    () => ReportDashboardcard,
    (reportDashboardcard) => reportDashboardcard.dashboard
  )
  reportDashboardcards: ReportDashboardcard[];
}
