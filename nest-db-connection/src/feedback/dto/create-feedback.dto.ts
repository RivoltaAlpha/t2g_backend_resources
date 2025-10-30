import { ApiProperty } from "@nestjs/swagger";
import { IsDateString, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class CreateFeedbackDto {
  @ApiProperty({ example: 5, description: 'Rating given by the user' })
  @IsNotEmpty()
  @IsString()
  rating: number;

  @ApiProperty({ example: 'Great event, had a wonderful time!'})
  @IsNotEmpty()
  @IsString()
  comments: string;

  @ApiProperty({ example: 1, description: 'ID of the event being reviewed' })
  @IsNotEmpty()
  @IsNumber()
  event_id: number;

  @ApiProperty({ example: 2, description: 'ID of the user providing the feedback' })
  @IsNotEmpty()
  @IsNumber()
  user_id: number;
}
