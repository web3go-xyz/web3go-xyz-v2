import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Collection } from "./Collection";
import { CoreUser } from "./CoreUser";

@Index("idx_snippet_collection_id", ["collectionId"], {})
@Index("native_query_snippet_entity_id_key", ["entityId"], { unique: true })
@Index("native_query_snippet_pkey", ["id"], { unique: true })
@Index("native_query_snippet_name_key", ["name"], { unique: true })
@Index("idx_snippet_name", ["name"], {})
@Entity("native_query_snippet", { schema: "public" })
export class NativeQuerySnippet {
  @PrimaryGeneratedColumn({ type: "integer", name: "id" })
  id: number;

  @Column("character varying", { name: "name", unique: true, length: 254 })
  name: string;

  @Column("text", { name: "description", nullable: true })
  description: string | null;

  @Column("text", { name: "content" })
  content: string;

  @Column("boolean", { name: "archived", default: () => "false" })
  archived: boolean;

  @Column("timestamp with time zone", {
    name: "created_at",
    default: () => "now()",
  })
  createdAt: Date;

  @Column("timestamp with time zone", {
    name: "updated_at",
    default: () => "now()",
  })
  updatedAt: Date;

  @Column("integer", { name: "collection_id", nullable: true })
  collectionId: number | null;

  @Column("character", {
    name: "entity_id",
    nullable: true,
    unique: true,
    length: 21,
  })
  entityId: string | null;

  @ManyToOne(() => Collection, (collection) => collection.nativeQuerySnippets, {
    onDelete: "SET NULL",
  })
  @JoinColumn([{ name: "collection_id", referencedColumnName: "id" }])
  collection: Collection;

  @ManyToOne(() => CoreUser, (coreUser) => coreUser.nativeQuerySnippets, {
    onDelete: "CASCADE",
  })
  @JoinColumn([{ name: "creator_id", referencedColumnName: "id" }])
  creator: CoreUser;
}
