import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Post } from '../../posts/entities/post.entity';

@Entity('Comment')
export class Comment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'text' })
  commentContent: string;

  @Column({ length: 255 })
  reviewBy: string;

  @Column()
  postId: number;

  @Column({ nullable: true })
  parentId: number;

  @Column({ default: false })
  isPublished: boolean;

  @CreateDateColumn()
  createdOn: Date;

  @UpdateDateColumn()
  lastModifiedOn: Date;

  @Column({ nullable: true })
  publishedOn: Date;

  // Relationships
  @ManyToOne(() => Post, (post) => post.comments)
  @JoinColumn({ name: 'postId' })
  post: Post;

  @ManyToOne(() => Comment, (comment) => comment.children, { nullable: true })
  @JoinColumn({ name: 'parentId' })
  parent: Comment;

  @OneToMany(() => Comment, (comment) => comment.parent)
  children: Comment[];
}
