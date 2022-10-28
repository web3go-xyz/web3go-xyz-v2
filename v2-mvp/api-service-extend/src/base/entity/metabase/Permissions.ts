import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { PermissionsGroup } from "./PermissionsGroup";

@Index("idx_permissions_group_id", ["groupId"], {})
@Index("idx_permissions_group_id_object", ["groupId", "object"], {})
@Index("permissions_group_id_object_key", ["groupId", "object"], {
  unique: true,
})
@Index("permissions_pkey", ["id"], { unique: true })
@Index("idx_permissions_object", ["object"], {})
@Entity("permissions", { schema: "public" })
export class Permissions {
  @PrimaryGeneratedColumn({ type: "integer", name: "id" })
  id: number;

  @Column("character varying", { name: "object", unique: true, length: 254 })
  object: string;

  @Column("integer", { name: "group_id", unique: true })
  groupId: number;

  @ManyToOne(
    () => PermissionsGroup,
    (permissionsGroup) => permissionsGroup.permissions,
    { onDelete: "CASCADE" }
  )
  @JoinColumn([{ name: "group_id", referencedColumnName: "id" }])
  group: PermissionsGroup;
}
