import {
  Column,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { GroupTableAccessPolicy } from "./GroupTableAccessPolicy";
import { Permissions } from "./Permissions";
import { PermissionsGroupMembership } from "./PermissionsGroupMembership";

@Index("permissions_group_pkey", ["id"], { unique: true })
@Index("idx_permissions_group_name", ["name"], {})
@Index("unique_permissions_group_name", ["name"], { unique: true })
@Entity("permissions_group", { schema: "public" })
export class PermissionsGroup {
  @PrimaryGeneratedColumn({ type: "integer", name: "id" })
  id: number;

  @Column("character varying", { name: "name", unique: true, length: 255 })
  name: string;

  @OneToMany(
    () => GroupTableAccessPolicy,
    (groupTableAccessPolicy) => groupTableAccessPolicy.group
  )
  groupTableAccessPolicies: GroupTableAccessPolicy[];

  @OneToMany(() => Permissions, (permissions) => permissions.group)
  permissions: Permissions[];

  @OneToMany(
    () => PermissionsGroupMembership,
    (permissionsGroupMembership) => permissionsGroupMembership.group
  )
  permissionsGroupMemberships: PermissionsGroupMembership[];
}
