import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Post } from '../../posts/entities/post.entity';

@Entity('Tag')
export class Tag {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 255 })
  title: string;

  @Column({ length: 255 })
  description: string;

  @Column({ length: 100 })
  slug: string;

  @Column({ default: false })
  isPublished: boolean;

  @CreateDateColumn()
  createdOn: Date;

  @UpdateDateColumn()
  lastModifiedOn: Date;

  @Column({ nullable: true })
  publishedOn: Date;

  // Relationships
  @ManyToMany(() => Post, (post) => post.tags)
  posts: Post[];
}
