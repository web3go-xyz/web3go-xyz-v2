import {
  Column,
  Entity,
  Index,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Activity } from "./Activity";
import { ApplicationPermissionsRevision } from "./ApplicationPermissionsRevision";
import { BookmarkOrdering } from "./BookmarkOrdering";
import { CardBookmark } from "./CardBookmark";
import { Collection } from "./Collection";
import { CollectionBookmark } from "./CollectionBookmark";
import { CollectionPermissionGraphRevision } from "./CollectionPermissionGraphRevision";
import { ComputationJob } from "./ComputationJob";
import { CoreSession } from "./CoreSession";
import { DashboardBookmark } from "./DashboardBookmark";
import { DashboardFavorite } from "./DashboardFavorite";
import { LoginHistory } from "./LoginHistory";
import { MetabaseDatabase } from "./MetabaseDatabase";
import { Metric } from "./Metric";
import { NativeQuerySnippet } from "./NativeQuerySnippet";
import { PermissionsGroupMembership } from "./PermissionsGroupMembership";
import { PermissionsRevision } from "./PermissionsRevision";
import { PersistedInfo } from "./PersistedInfo";
import { Pulse } from "./Pulse";
import { PulseChannelRecipient } from "./PulseChannelRecipient";
import { ReportCard } from "./ReportCard";
import { ReportCardfavorite } from "./ReportCardfavorite";
import { ReportDashboard } from "./ReportDashboard";
import { Revision } from "./Revision";
import { Secret } from "./Secret";
import { Segment } from "./Segment";
import { Timeline } from "./Timeline";
import { TimelineEvent } from "./TimelineEvent";
import { ViewLog } from "./ViewLog";

@Index("core_user_email_key", ["email"], { unique: true })
@Index("core_user_pkey", ["id"], { unique: true })
@Entity("core_user", { schema: "public" })
export class CoreUser {
  @PrimaryGeneratedColumn({ type: "integer", name: "id" })
  id: number;

  @Column("citext", { name: "email", unique: true })
  email: string;

  @Column("character varying", {
    name: "first_name",
    nullable: true,
    length: 254,
  })
  firstName: string | null;

  @Column("character varying", {
    name: "last_name",
    nullable: true,
    length: 254,
  })
  lastName: string | null;

  @Column("character varying", {
    name: "password",
    nullable: true,
    length: 254,
  })
  password: string | null;

  @Column("character varying", {
    name: "password_salt",
    nullable: true,
    length: 254,
    default: () => "'default'",
  })
  passwordSalt: string | null;

  @Column("timestamp with time zone", { name: "date_joined" })
  dateJoined: Date;

  @Column("timestamp with time zone", { name: "last_login", nullable: true })
  lastLogin: Date | null;

  @Column("boolean", { name: "is_superuser", default: () => "false" })
  isSuperuser: boolean;

  @Column("boolean", { name: "is_active", default: () => "true" })
  isActive: boolean;

  @Column("character varying", {
    name: "reset_token",
    nullable: true,
    length: 254,
  })
  resetToken: string | null;

  @Column("bigint", { name: "reset_triggered", nullable: true })
  resetTriggered: string | null;

  @Column("boolean", { name: "is_qbnewb", default: () => "true" })
  isQbnewb: boolean;

  @Column("boolean", { name: "google_auth", default: () => "false" })
  googleAuth: boolean;

  @Column("boolean", { name: "ldap_auth", default: () => "false" })
  ldapAuth: boolean;

  @Column("text", { name: "login_attributes", nullable: true })
  loginAttributes: string | null;

  @Column("timestamp without time zone", { name: "updated_at", nullable: true })
  updatedAt: Date | null;

  @Column("character varying", {
    name: "sso_source",
    nullable: true,
    length: 254,
  })
  ssoSource: string | null;

  @Column("character varying", { name: "locale", nullable: true, length: 5 })
  locale: string | null;

  @Column("boolean", { name: "is_datasetnewb", default: () => "true" })
  isDatasetnewb: boolean;

  @Column("text", { name: "settings", nullable: true })
  settings: string | null;

  @OneToMany(() => Activity, (activity) => activity.user)
  activities: Activity[];

  @OneToMany(
    () => ApplicationPermissionsRevision,
    (applicationPermissionsRevision) => applicationPermissionsRevision.user
  )
  applicationPermissionsRevisions: ApplicationPermissionsRevision[];

  @OneToMany(
    () => BookmarkOrdering,
    (bookmarkOrdering) => bookmarkOrdering.user
  )
  bookmarkOrderings: BookmarkOrdering[];

  @OneToMany(() => CardBookmark, (cardBookmark) => cardBookmark.user)
  cardBookmarks: CardBookmark[];

  @OneToOne(() => Collection, (collection) => collection.personalOwner)
  collection: Collection;

  @OneToMany(
    () => CollectionBookmark,
    (collectionBookmark) => collectionBookmark.user
  )
  collectionBookmarks: CollectionBookmark[];

  @OneToMany(
    () => CollectionPermissionGraphRevision,
    (collectionPermissionGraphRevision) =>
      collectionPermissionGraphRevision.user
  )
  collectionPermissionGraphRevisions: CollectionPermissionGraphRevision[];

  @OneToMany(() => ComputationJob, (computationJob) => computationJob.creator)
  computationJobs: ComputationJob[];

  @OneToMany(() => CoreSession, (coreSession) => coreSession.user)
  coreSessions: CoreSession[];

  @OneToMany(
    () => DashboardBookmark,
    (dashboardBookmark) => dashboardBookmark.user
  )
  dashboardBookmarks: DashboardBookmark[];

  @OneToMany(
    () => DashboardFavorite,
    (dashboardFavorite) => dashboardFavorite.user
  )
  dashboardFavorites: DashboardFavorite[];

  @OneToMany(() => LoginHistory, (loginHistory) => loginHistory.user)
  loginHistories: LoginHistory[];

  @OneToMany(
    () => MetabaseDatabase,
    (metabaseDatabase) => metabaseDatabase.creator
  )
  metabaseDatabases: MetabaseDatabase[];

  @OneToMany(() => Metric, (metric) => metric.creator)
  metrics: Metric[];

  @OneToMany(
    () => NativeQuerySnippet,
    (nativeQuerySnippet) => nativeQuerySnippet.creator
  )
  nativeQuerySnippets: NativeQuerySnippet[];

  @OneToMany(
    () => PermissionsGroupMembership,
    (permissionsGroupMembership) => permissionsGroupMembership.user
  )
  permissionsGroupMemberships: PermissionsGroupMembership[];

  @OneToMany(
    () => PermissionsRevision,
    (permissionsRevision) => permissionsRevision.user
  )
  permissionsRevisions: PermissionsRevision[];

  @OneToMany(() => PersistedInfo, (persistedInfo) => persistedInfo.creator)
  persistedInfos: PersistedInfo[];

  @OneToMany(() => Pulse, (pulse) => pulse.creator)
  pulses: Pulse[];

  @OneToMany(
    () => PulseChannelRecipient,
    (pulseChannelRecipient) => pulseChannelRecipient.user
  )
  pulseChannelRecipients: PulseChannelRecipient[];

  @OneToMany(() => ReportCard, (reportCard) => reportCard.creatorId)
  reportCards: ReportCard[];

  @OneToMany(() => ReportCard, (reportCard) => reportCard.made_public_by_id)
  reportCards2: ReportCard[];

  @OneToMany(
    () => ReportCardfavorite,
    (reportCardfavorite) => reportCardfavorite.owner
  )
  reportCardfavorites: ReportCardfavorite[];

  @OneToMany(
    () => ReportDashboard,
    (reportDashboard) => reportDashboard.creator
  )
  reportDashboards: ReportDashboard[];

  @OneToMany(
    () => ReportDashboard,
    (reportDashboard) => reportDashboard.madePublicBy
  )
  reportDashboards2: ReportDashboard[];

  @OneToMany(() => Revision, (revision) => revision.user)
  revisions: Revision[];

  @OneToMany(() => Secret, (secret) => secret.creator)
  secrets: Secret[];

  @OneToMany(() => Segment, (segment) => segment.creator)
  segments: Segment[];

  @OneToMany(() => Timeline, (timeline) => timeline.creator)
  timelines: Timeline[];

  @OneToMany(() => TimelineEvent, (timelineEvent) => timelineEvent.creator)
  timelineEvents: TimelineEvent[];

  @OneToMany(() => ViewLog, (viewLog) => viewLog.user)
  viewLogs: ViewLog[];
}
