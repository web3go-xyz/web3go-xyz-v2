import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { CoreUser } from "./CoreUser";

@Index("collection_revision_pkey", ["id"], { unique: true })
@Entity("collection_permission_graph_revision", { schema: "public" })
export class CollectionPermissionGraphRevision {
  @PrimaryGeneratedColumn({ type: "integer", name: "id" })
  id: number;

  @Column("text", { name: "before" })
  before: string;

  @Column("text", { name: "after" })
  after: string;

  @Column("timestamp without time zone", { name: "created_at" })
  createdAt: Date;

  @Column("text", { name: "remark", nullable: true })
  remark: string | null;

  @ManyToOne(
    () => CoreUser,
    (coreUser) => coreUser.collectionPermissionGraphRevisions,
    { onDelete: "CASCADE" }
  )
  @JoinColumn([{ name: "user_id", referencedColumnName: "id" }])
  user: CoreUser;
}
