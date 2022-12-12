import {
  Column,
  Entity,
  Index,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { CoreUser } from "./CoreUser";
import { CollectionBookmark } from "./CollectionBookmark";
import { NativeQuerySnippet } from "./NativeQuerySnippet";
import { Pulse } from "./Pulse";
import { ReportCard } from "./ReportCard";
import { ReportDashboard } from "./ReportDashboard";
import { Timeline } from "./Timeline";

@Index("collection_entity_id_key", ["entityId"], { unique: true })
@Index("collection_pkey", ["id"], { unique: true })
@Index("idx_collection_location", ["location"], {})
@Index("unique_collection_personal_owner_id", ["personalOwnerId"], {
  unique: true,
})
@Index("idx_collection_personal_owner_id", ["personalOwnerId"], {})
@Entity("collection", { schema: "public" })
export class Collection {
  @PrimaryGeneratedColumn({ type: "integer", name: "id" })
  id: number;

  @Column("text", { name: "name" })
  name: string;

  @Column("text", { name: "description", nullable: true })
  description: string | null;

  @Column("character", { name: "color", length: 7 })
  color: string;

  @Column("boolean", { name: "archived", default: () => "false" })
  archived: boolean;

  @Column("character varying", {
    name: "location",
    length: 254,
    default: () => "'/'",
  })
  location: string;

  @Column("integer", {
    name: "personal_owner_id",
    nullable: true,
    unique: true,
  })
  personalOwnerId: number | null;

  @Column("character varying", { name: "slug", length: 254 })
  slug: string;

  @Column("character varying", {
    name: "namespace",
    nullable: true,
    length: 254,
  })
  namespace: string | null;

  @Column("character varying", {
    name: "authority_level",
    nullable: true,
    length: 255,
  })
  authorityLevel: string | null;

  @Column("character", {
    name: "entity_id",
    nullable: true,
    unique: true,
    length: 21,
  })
  entityId: string | null;

  @OneToOne(() => CoreUser, (coreUser) => coreUser.collection, {
    onDelete: "CASCADE",
  })
  @JoinColumn([{ name: "personal_owner_id", referencedColumnName: "id" }])
  personalOwner: CoreUser;

  @OneToMany(
    () => CollectionBookmark,
    (collectionBookmark) => collectionBookmark.collection
  )
  collectionBookmarks: CollectionBookmark[];

  @OneToMany(
    () => NativeQuerySnippet,
    (nativeQuerySnippet) => nativeQuerySnippet.collection
  )
  nativeQuerySnippets: NativeQuerySnippet[];

  @OneToMany(() => Pulse, (pulse) => pulse.collection)
  pulses: Pulse[];

  @OneToMany(() => ReportCard, (reportCard) => reportCard.collectionId)
  reportCards: ReportCard[];

  @OneToMany(
    () => ReportDashboard,
    (reportDashboard) => reportDashboard.collectionId
  )
  reportDashboards: ReportDashboard[];

  @OneToMany(() => Timeline, (timeline) => timeline.collection)
  timelines: Timeline[];
}
