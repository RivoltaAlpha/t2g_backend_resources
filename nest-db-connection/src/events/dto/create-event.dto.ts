import {
  IsDateString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

// shape of data
// creating & updating data
export class CreateEventDto {
  @IsNotEmpty()
  @IsString()
  event_name: string;

  @IsNotEmpty()
  @IsString()
  event_date: string;

  @IsNotEmpty()
  @IsString()
  event_location: string;

  @IsNotEmpty()
  @IsString()
  event_description: string;

  @IsNotEmpty()
  @IsNumber()
  createdby: number;

  @IsOptional()
  @IsDateString()
  created_at?: string;

  @IsOptional()
  @IsDateString()
  updated_at?: string;
}
