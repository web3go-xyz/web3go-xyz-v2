import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { ReportCard } from "./ReportCard";
import { Label } from "./Label";

@Index("unique_card_label_card_id_label_id", ["cardId", "labelId"], {
  unique: true,
})
@Index("idx_card_label_card_id", ["cardId"], {})
@Index("card_label_pkey", ["id"], { unique: true })
@Index("idx_card_label_label_id", ["labelId"], {})
@Entity("card_label", { schema: "public" })
export class CardLabel {
  @PrimaryGeneratedColumn({ type: "integer", name: "id" })
  id: number;

  @Column("integer", { name: "card_id", unique: true })
  cardId: number;

  @Column("integer", { name: "label_id", unique: true })
  labelId: number;

  @ManyToOne(() => ReportCard, (reportCard) => reportCard.cardLabels, {
    onDelete: "CASCADE",
  })
  @JoinColumn([{ name: "card_id", referencedColumnName: "id" }])
  card: ReportCard;

  @ManyToOne(() => Label, (label) => label.cardLabels, { onDelete: "CASCADE" })
  @JoinColumn([{ name: "label_id", referencedColumnName: "id" }])
  label: Label;
}
