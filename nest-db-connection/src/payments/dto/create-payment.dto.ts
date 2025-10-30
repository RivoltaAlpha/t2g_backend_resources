import { IsDateString, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";
import { PaymentMethod, PaymentsStatus } from "../entities/payment.entity";
import { ApiProperty } from "@nestjs/swagger";

export class CreatePaymentDto {
  @ApiProperty({ example: '2023-01-01', description: 'Date of the payment' })
    @IsNotEmpty()
      @IsString()
      @IsDateString()
      payment_date: string;
    
      @ApiProperty({ example: 100.50, description: 'Amount paid' })
      @IsNotEmpty()
      @IsNumber()
      amount: number;
    
      @ApiProperty({ example: PaymentsStatus.Pending, description: 'Status of the payment', enum: PaymentsStatus })
      @IsNotEmpty()
      @IsString()
      @IsEnum(PaymentsStatus)
      payment_status: PaymentsStatus;
    
      @ApiProperty({ example: PaymentMethod.Mpesa, description: 'Method of payment', enum: PaymentMethod })
      @IsNotEmpty()
      @IsString()
      @IsEnum(PaymentMethod)
      payment_method: PaymentMethod;
    
      @ApiProperty({ example: 1, description: 'ID of the registration associated with the payment' })
      @IsNotEmpty()
      @IsNumber()
      registration_id: number;
}
