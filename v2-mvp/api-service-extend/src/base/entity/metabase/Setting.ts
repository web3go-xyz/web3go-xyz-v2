import { Column, Entity, Index } from "typeorm";

@Index("setting_pkey", ["key"], { unique: true })
@Entity("setting", { schema: "public" })
export class Setting {
  @Column("character varying", { primary: true, name: "key", length: 254 })
  key: string;

  @Column("text", { name: "value" })
  value: string;
}
