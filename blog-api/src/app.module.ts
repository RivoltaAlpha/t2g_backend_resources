import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PostsModule } from './posts/posts.module';
import { CategoriesModule } from './categories/categories.module';
import { CommentsModule } from './comments/comments.module';
import { TagsModule } from './tags/tags.module';
import { Post } from './posts/entities/post.entity';
import { Category } from './categories/entities/category.entity';
import { Tag } from './tags/entities/tag.entity';
import { Comment } from './comments/entities/comment.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '3306'),
      username: process.env.DB_USERNAME || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'blog_db',
      entities: [Post, Category, Tag, Comment],
      synchronize: process.env.NODE_ENV !== 'production', // Only for development
      logging: process.env.NODE_ENV === 'development',
    }),
    PostsModule, 
    CategoriesModule, 
    CommentsModule, 
    TagsModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
