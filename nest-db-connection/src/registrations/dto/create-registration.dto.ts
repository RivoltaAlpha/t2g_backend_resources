import {
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { PaymentStatus } from '../entities/registration.entity';
import { ApiProperty } from '@nestjs/swagger';

export class CreateRegistrationDto {
  @ApiProperty({
    example: '2023-05-15',
    description: 'Date of the registration',
  })
  @IsNotEmpty()
  @IsString()
  @IsDateString()
  registration_date: string;

  @ApiProperty({
    example: PaymentStatus.Pending,
    description: 'Status of the payment',
    enum: PaymentStatus,
  })
  @IsNotEmpty()
  @IsString()
  @IsEnum(PaymentStatus)
  payment_status: PaymentStatus;

  @ApiProperty({ example: 150.75, description: 'Amount for the registration' })
  @IsNotEmpty()
  @IsNumber()
  payment_amount: number;

  @ApiProperty({
    example: 1,
    description: 'ID of the event being registered for',
  })
  @IsNotEmpty()
  @IsNumber()
  event_id: number;

  @ApiProperty({
    example: 2,
    description: 'ID of the user registering for the event',
  })
  @IsNotEmpty()
  @IsNumber()
  user_id: number;
}
