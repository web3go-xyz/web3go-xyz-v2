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

@Index("idx_unique_cardfavorite_card_id_owner_id", ["cardId", "ownerId"], {
  unique: true,
})
@Index("idx_cardfavorite_card_id", ["cardId"], {})
@Index("report_cardfavorite_pkey", ["id"], { unique: true })
@Index("idx_cardfavorite_owner_id", ["ownerId"], {})
@Entity("report_cardfavorite", { schema: "public" })
export class ReportCardfavorite {
  @PrimaryGeneratedColumn({ type: "integer", name: "id" })
  id: number;

  @Column("timestamp with time zone", { name: "created_at" })
  createdAt: Date;

  @Column("timestamp with time zone", { name: "updated_at" })
  updatedAt: Date;

  @Column("integer", { name: "card_id", unique: true })
  cardId: number;

  @Column("integer", { name: "owner_id", unique: true })
  ownerId: number;

  @ManyToOne(() => ReportCard, (reportCard) => reportCard.reportCardfavorites, {
    onDelete: "CASCADE",
  })
  @JoinColumn([{ name: "card_id", referencedColumnName: "id" }])
  card: ReportCard;

  @ManyToOne(() => CoreUser, (coreUser) => coreUser.reportCardfavorites, {
    onDelete: "CASCADE",
  })
  @JoinColumn([{ name: "owner_id", referencedColumnName: "id" }])
  owner: CoreUser;
}
