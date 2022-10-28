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

@Index(
  "unique_collection_bookmark_user_id_collection_id",
  ["collectionId", "userId"],
  { unique: true }
)
@Index("idx_collection_bookmark_collection_id", ["collectionId"], {})
@Index("collection_bookmark_pkey", ["id"], { unique: true })
@Index("idx_collection_bookmark_user_id", ["userId"], {})
@Entity("collection_bookmark", { schema: "public" })
export class CollectionBookmark {
  @PrimaryGeneratedColumn({ type: "integer", name: "id" })
  id: number;

  @Column("integer", { name: "user_id", unique: true })
  userId: number;

  @Column("integer", { name: "collection_id", unique: true })
  collectionId: number;

  @Column("timestamp with time zone", {
    name: "created_at",
    default: () => "now()",
  })
  createdAt: Date;

  @ManyToOne(() => Collection, (collection) => collection.collectionBookmarks, {
    onDelete: "CASCADE",
  })
  @JoinColumn([{ name: "collection_id", referencedColumnName: "id" }])
  collection: Collection;

  @ManyToOne(() => CoreUser, (coreUser) => coreUser.collectionBookmarks, {
    onDelete: "CASCADE",
  })
  @JoinColumn([{ name: "user_id", referencedColumnName: "id" }])
  user: CoreUser;
}
