import { IsDateString, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class CreateFeedbackDto {
  @IsNotEmpty()
  @IsString()
  rating: number;

  @IsNotEmpty()
  @IsString()
  comments: string;

  @IsNotEmpty()
  @IsNumber()
  event_id: number;

  @IsNotEmpty()
  @IsNumber()
  user_id: number;

  @IsOptional()
  @IsDateString()
  created_at?: string;

  @IsOptional()
  @IsDateString()
  updated_at?: string;
}
