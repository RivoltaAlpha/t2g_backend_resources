import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsNumber,
  IsString,
} from 'class-validator';

// shape of data
// creating & updating data
export class CreateEventDto {
    @ApiProperty({example: 'Annual Tech Conference'})
  @IsNotEmpty()
  @IsString()
  event_name: string;

  @ApiProperty({example: '2024-12-15'})
  @IsNotEmpty()
  @IsString()
  event_date: string;

  @ApiProperty({example: 'Sarit Centre, Nairobi'})
  @IsNotEmpty()
  @IsString()
  event_location: string;

  @ApiProperty({example: 'A gathering of tech enthusiasts to discuss emerging technologies.'})
  @IsNotEmpty()
  @IsString()
  event_description: string;

  @ApiProperty({example: 1})
  @IsNotEmpty()
  @IsNumber()
  createdby: number;
}
