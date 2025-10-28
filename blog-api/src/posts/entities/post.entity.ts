import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, OneToMany, JoinTable, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Category } from '../../categories/entities/category.entity';
import { Tag } from '../../tags/entities/tag.entity';
import { Comment } from '../../comments/entities/comment.entity';

@Entity('Post')
export class Post {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 255 })
  title: string;

  @Column({ length: 100 })
  slug: string;

  @Column({ type: 'text' })
  summary: string;

  @Column({ type: 'longtext' })
  postContent: string;

  @Column({ length: 255, nullable: true })
  categoryId: string;

  @Column({ default: false })
  isPublished: boolean;

  @CreateDateColumn()
  createdOn: Date;

  @UpdateDateColumn()
  lastModifiedOn: Date;

  @Column({ nullable: true })
  publishedOn: Date;

  // Relationships
  @ManyToMany(() => Category, (category) => category.posts)
  @JoinTable({
    name: 'PostCategories',
    joinColumn: { name: 'postId', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'categoryId', referencedColumnName: 'id' }
  })
  categories: Category[];

  @ManyToMany(() => Tag, (tag) => tag.posts)
  @JoinTable({
    name: 'PostTags',
    joinColumn: { name: 'postId', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'tagId', referencedColumnName: 'id' }
  })
  tags: Tag[];

  @OneToMany(() => Comment, (comment) => comment.post)
  comments: Comment[];
}
