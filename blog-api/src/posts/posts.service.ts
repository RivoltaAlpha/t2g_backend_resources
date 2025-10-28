import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { Post } from './entities/post.entity';
import { Category } from '../categories/entities/category.entity';
import { Tag } from '../tags/entities/tag.entity';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post)
    private postRepository: Repository<Post>,
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
    @InjectRepository(Tag)
    private tagRepository: Repository<Tag>,
  ) {}

  async create(createPostDto: CreatePostDto): Promise<Post> {
    const post = this.postRepository.create(createPostDto);
    
    // Handle categories relationship
    if (createPostDto.categoryIds && createPostDto.categoryIds.length > 0) {
      const categories = await this.categoryRepository.findBy({
        id: In(createPostDto.categoryIds),
      });
      post.categories = categories;
    }

    // Handle tags relationship
    if (createPostDto.tagIds && createPostDto.tagIds.length > 0) {
      const tags = await this.tagRepository.findBy({
        id: In(createPostDto.tagIds),
      });
      post.tags = tags;
    }

    return this.postRepository.save(post);
  }

  async findAll(): Promise<Post[]> {
    return this.postRepository.find({
      relations: ['categories', 'tags', 'comments'],
    });
  }

  async findOne(id: number): Promise<Post | null> {
    return this.postRepository.findOne({
      where: { id },
      relations: ['categories', 'tags', 'comments'],
    });
  }

  async update(id: number, updatePostDto: UpdatePostDto): Promise<Post> {
    const post = await this.findOne(id);
    
    if (!post) {
      throw new Error(`Post with ID ${id} not found`);
    }
    
    // Update basic fields
    Object.assign(post, updatePostDto);

    // Handle categories relationship
    if (updatePostDto.categoryIds) {
      const categories = await this.categoryRepository.findBy({
        id: In(updatePostDto.categoryIds),
      });
      post.categories = categories;
    }

    // Handle tags relationship
    if (updatePostDto.tagIds) {
      const tags = await this.tagRepository.findBy({
        id: In(updatePostDto.tagIds),
      });
      post.tags = tags;
    }

    return this.postRepository.save(post);
  }

  async remove(id: number): Promise<void> {
    await this.postRepository.delete(id);
  }

  async findByCategory(categoryId: number): Promise<Post[]> {
    return this.postRepository
      .createQueryBuilder('post')
      .leftJoinAndSelect('post.categories', 'category')
      .where('category.id = :categoryId', { categoryId })
      .getMany();
  }

  async findByTag(tagId: number): Promise<Post[]> {
    return this.postRepository
      .createQueryBuilder('post')
      .leftJoinAndSelect('post.tags', 'tag')
      .where('tag.id = :tagId', { tagId })
      .getMany();
  }
}
