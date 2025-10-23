import { IsDateString, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";
import { PaymentStatus } from "../entities/registration.entity";

export class CreateRegistrationDto {
        @IsNotEmpty()
          @IsString()
          @IsDateString()
          registration_date: string;
        
          @IsNotEmpty()
          @IsString()
          @IsEnum(PaymentStatus)
          payment_status: PaymentStatus;
        
          @IsNotEmpty()
          @IsNumber()
          payment_amount: number;
        
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
