import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { CoreUser } from "./CoreUser";

@Index("bookmark_ordering_pkey", ["id"], { unique: true })
@Index("unique_bookmark_user_id_type_item_id", ["itemId", "type", "userId"], {
  unique: true,
})
@Index("unique_bookmark_user_id_ordering", ["ordering", "userId"], {
  unique: true,
})
@Index("idx_bookmark_ordering_user_id", ["userId"], {})
@Entity("bookmark_ordering", { schema: "public" })
export class BookmarkOrdering {
  @PrimaryGeneratedColumn({ type: "integer", name: "id" })
  id: number;

  @Column("integer", { name: "user_id" })
  userId: number;

  @Column("character varying", { name: "type", unique: true, length: 255 })
  type: string;

  @Column("integer", { name: "item_id", unique: true })
  itemId: number;

  @Column("integer", { name: "ordering", unique: true })
  ordering: number;

  @ManyToOne(() => CoreUser, (coreUser) => coreUser.bookmarkOrderings, {
    onDelete: "CASCADE",
  })
  @JoinColumn([{ name: "user_id", referencedColumnName: "id" }])
  user: CoreUser;
}
