import { IsDateString, IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString, MinLength } from "class-validator";
import { UserRole } from "../entities/user.entity";

export class CreateUserDto {
     @IsNotEmpty()
      @IsString()
      name: string;
    
      @IsNotEmpty()
      @IsString()
      @IsEmail()
      email: string;
    
      @IsNotEmpty()
      @IsString()
      @MinLength(8)
      password: string;
    
      @IsNotEmpty()
      @IsString()
      phone: string;
    
      @IsOptional()
      @IsString()
      hashedRefreshedToken?: string | null;

      @IsNotEmpty()
      @IsEnum(UserRole)
      role: UserRole;

      @IsOptional()
      @IsDateString()
      created_at?: string;
    
      @IsOptional()
      @IsDateString()
      updated_at?: string;
}
