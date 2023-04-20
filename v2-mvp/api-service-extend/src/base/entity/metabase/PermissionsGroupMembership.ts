import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { PermissionsGroup } from "./PermissionsGroup";
import { CoreUser } from "./CoreUser";

@Index(
  "idx_permissions_group_membership_group_id_user_id",
  ["groupId", "userId"],
  {}
)
@Index(
  "unique_permissions_group_membership_user_id_group_id",
  ["groupId", "userId"],
  { unique: true }
)
@Index("idx_permissions_group_membership_group_id", ["groupId"], {})
@Index("permissions_group_membership_pkey", ["id"], { unique: true })
@Index("idx_permissions_group_membership_user_id", ["userId"], {})
@Entity("permissions_group_membership", { schema: "public" })
export class PermissionsGroupMembership {
  @PrimaryGeneratedColumn({ type: "integer", name: "id" })
  id: number;

  @Column("integer", { name: "user_id", unique: true })
  userId: number;

  @Column("integer", { name: "group_id", unique: true })
  groupId: number;

  @Column("boolean", { name: "is_group_manager", default: () => "false" })
  isGroupManager: boolean;

  @ManyToOne(
    () => PermissionsGroup,
    (permissionsGroup) => permissionsGroup.permissionsGroupMemberships,
    { onDelete: "CASCADE" }
  )
  @JoinColumn([{ name: "group_id", referencedColumnName: "id" }])
  group: PermissionsGroup;

  @ManyToOne(
    () => CoreUser,
    (coreUser) => coreUser.permissionsGroupMemberships,
    { onDelete: "CASCADE" }
  )
  @JoinColumn([{ name: "user_id", referencedColumnName: "id" }])
  user: CoreUser;
}
