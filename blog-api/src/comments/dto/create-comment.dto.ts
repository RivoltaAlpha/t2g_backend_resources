import { IsString, IsNotEmpty, IsOptional, IsBoolean, IsNumber, MaxLength } from 'class-validator';

export class CreateCommentDto {
  @IsString()
  @IsNotEmpty()
  commentContent: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  reviewBy: string;

  @IsNumber()
  @IsNotEmpty()
  postId: number;

  @IsOptional()
  @IsNumber()
  parentId?: number;

  @IsOptional()
  @IsBoolean()
  isPublished?: boolean;

  @IsOptional()
  publishedOn?: Date;
}
