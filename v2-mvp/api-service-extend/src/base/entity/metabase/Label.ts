import {
  Column,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { CardLabel } from "./CardLabel";

@Index("label_pkey", ["id"], { unique: true })
@Index("label_slug_key", ["slug"], { unique: true })
@Index("idx_label_slug", ["slug"], {})
@Entity("label", { schema: "public" })
export class Label {
  @PrimaryGeneratedColumn({ type: "integer", name: "id" })
  id: number;

  @Column("character varying", { name: "name", length: 254 })
  name: string;

  @Column("character varying", { name: "slug", unique: true, length: 254 })
  slug: string;

  @Column("character varying", { name: "icon", nullable: true, length: 128 })
  icon: string | null;

  @OneToMany(() => CardLabel, (cardLabel) => cardLabel.label)
  cardLabels: CardLabel[];
}
