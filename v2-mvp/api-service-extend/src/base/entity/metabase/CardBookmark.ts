import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { ReportCard } from "./ReportCard";
import { CoreUser } from "./CoreUser";

@Index("idx_card_bookmark_card_id", ["cardId"], {})
@Index("unique_card_bookmark_user_id_card_id", ["cardId", "userId"], {
  unique: true,
})
@Index("card_bookmark_pkey", ["id"], { unique: true })
@Index("idx_card_bookmark_user_id", ["userId"], {})
@Entity("card_bookmark", { schema: "public" })
export class CardBookmark {
  @PrimaryGeneratedColumn({ type: "integer", name: "id" })
  id: number;

  @Column("integer", { name: "user_id", unique: true })
  userId: number;

  @Column("integer", { name: "card_id", unique: true })
  cardId: number;

  @Column("timestamp with time zone", {
    name: "created_at",
    default: () => "now()",
  })
  createdAt: Date;

  @ManyToOne(() => ReportCard, (reportCard) => reportCard.cardBookmarks, {
    onDelete: "CASCADE",
  })
  @JoinColumn([{ name: "card_id", referencedColumnName: "id" }])
  card: ReportCard;

  @ManyToOne(() => CoreUser, (coreUser) => coreUser.cardBookmarks, {
    onDelete: "CASCADE",
  })
  @JoinColumn([{ name: "user_id", referencedColumnName: "id" }])
  user: CoreUser;
}
