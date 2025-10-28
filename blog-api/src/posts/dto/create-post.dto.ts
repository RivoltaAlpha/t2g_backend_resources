import { IsString, IsNotEmpty, IsOptional, IsBoolean, IsArray, MaxLength } from 'class-validator';

export class CreatePostDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  title: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  slug: string;

  @IsString()
  @IsNotEmpty()
  summary: string;

  @IsString()
  @IsNotEmpty()
  postContent: string;

  @IsOptional()
  @IsString()
  categoryId?: string;

  @IsOptional()
  @IsBoolean()
  isPublished?: boolean;

  @IsOptional()
  publishedOn?: Date;

  @IsOptional()
  @IsArray()
  categoryIds?: number[];

  @IsOptional()
  @IsArray()
  tagIds?: number[];
}
