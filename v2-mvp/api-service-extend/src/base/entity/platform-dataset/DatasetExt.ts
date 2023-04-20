import { ApiProperty } from '@nestjs/swagger';
import { Entity, Column, PrimaryColumn, Index } from 'typeorm';

@Entity('dataset_ext', { schema: 'public' })
@Index('idx_dataset_ext_creatorAccountId', ['creatorAccountId'], {
  unique: false,
})
export class DatasetExt {
  @PrimaryColumn({
    type: 'integer',
    name: 'id',
    comment: 'refer to dataset_id',
  })
  id: number;

  @Column({ type: 'text', name: 'name', comment: 'dataset name' })
  name: string;

  @Column({
    type: 'text',
    name: 'creator_account_id',
    comment: 'refer to account.accountId',
  })
  creatorAccountId: string;

  @Column({
    name: 'created_at',
  })
  createdAt: Date;

  @Column({
    name: 'updated_at',
  })
  updatedAt: Date;

  @ApiProperty({
    description: 'view count',
  })
  @Column({
    name: 'view_count',
    type: 'integer',
    default: 0,
  })
  viewCount: number;

  @ApiProperty({
    description: 'share count',
  })
  @Column({
    name: 'share_count',
    type: 'integer',
    default: 0,
  })
  shareCount: number;

  @ApiProperty({
    description: 'favorite count',
  })
  @Column({
    name: 'favorite_count',
    type: 'integer',
    default: 0,
  })
  favoriteCount: number;

  @ApiProperty({
    description: 'dashboard_count count',
  })
  @Column({
    name: 'dashboard_count',
    type: 'integer',
    default: 0,
  })
  dashboardCount: number;

  @ApiProperty({
    description: 'fork count',
  })
  @Column({
    name: 'fork_count',
    type: 'integer',
    default: 0,
  })
  forkCount: number;

  @Column({
    type: 'integer',
    name: 'is_public',
    comment: '0:draft,1:public',
    default: 0,
  })
  isPublic: string;

  @Column('boolean', { name: 'archived', default: () => 'false' })
  archived: boolean;

  @Column({
    name: 'preview_img',
    comment: 'Preview image url',
  })
  previewImg?: string;

  @Column({
    type: 'text',
    name: 'public_uuid',
    comment: 'public_uuid, refer to metatbase.report_dashboard.public_uuid',
    default: '',
    nullable: true,
  })
  publicUUID: string;

  @Column({
    type: 'text',
    name: 'public_link',
    comment: 'publick link, formatted with public_uuid',
    default: '',
    nullable: true,
  })
  publicLink: string;
}
