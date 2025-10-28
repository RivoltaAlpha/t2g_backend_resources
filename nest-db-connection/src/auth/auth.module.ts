import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";
import { TypeOrmModule } from "@nestjs/typeorm";
import { DatabaseModule } from "src/database/database.module";
import { User } from "src/users/entities/user.entity";
import { AuthService } from "./auth.service";
import { Module } from "@nestjs/common";
import { AuthController } from "./auth.controller";

@Module({
    imports: [
        DatabaseModule,
        PassportModule,
        JwtModule.register(
            {
                global: true
            }
        ),
        TypeOrmModule.forFeature([User]),
    ],
    providers: [AuthService],
    controllers: [AuthController],
    exports: [],
})

export class AuthModule {}