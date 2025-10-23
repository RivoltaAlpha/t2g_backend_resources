import { IsDateString, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";
import { PaymentMethod, PaymentsStatus } from "../entities/payment.entity";

export class CreatePaymentDto {
    @IsNotEmpty()
      @IsString()
      @IsDateString()
      payment_date: string;
    
      @IsNotEmpty()
      @IsString()
      amount: number;
    
      @IsNotEmpty()
      @IsString()
      @IsEnum(PaymentsStatus)
      payment_status: PaymentsStatus;
    
      @IsNotEmpty()
      @IsString()
      @IsEnum(PaymentMethod)
      payment_method: PaymentMethod;
    
      @IsNotEmpty()
      @IsNumber()
      registration_id: number;
    
      @IsOptional()
      @IsDateString()
      created_at?: string;
    
      @IsOptional()
      @IsDateString()
      updated_at?: string;
}
