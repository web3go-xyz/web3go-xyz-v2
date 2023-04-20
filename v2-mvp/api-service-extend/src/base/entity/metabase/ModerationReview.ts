import { Column, Entity, Index, PrimaryGeneratedColumn } from "typeorm";

@Index("moderation_review_pkey", ["id"], { unique: true })
@Index(
  "idx_moderation_review_item_type_item_id",
  ["moderatedItemId", "moderatedItemType"],
  {}
)
@Entity("moderation_review", { schema: "public" })
export class ModerationReview {
  @PrimaryGeneratedColumn({ type: "integer", name: "id" })
  id: number;

  @Column("timestamp with time zone", {
    name: "updated_at",
    default: () => "now()",
  })
  updatedAt: Date;

  @Column("timestamp with time zone", {
    name: "created_at",
    default: () => "now()",
  })
  createdAt: Date;

  @Column("character varying", { name: "status", nullable: true, length: 255 })
  status: string | null;

  @Column("text", { name: "text", nullable: true })
  text: string | null;

  @Column("integer", { name: "moderated_item_id" })
  moderatedItemId: number;

  @Column("character varying", { name: "moderated_item_type", length: 255 })
  moderatedItemType: string;

  @Column("integer", { name: "moderator_id" })
  moderatorId: number;

  @Column("boolean", { name: "most_recent" })
  mostRecent: boolean;
}
