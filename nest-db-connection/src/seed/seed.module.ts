import { Module } from '@nestjs/common';
import { SeedService } from './seed.service';
import { SeedController } from './seed.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';
import { Event } from '../events/entities/event.entity';
import { Payment } from '../payments/entities/payment.entity';
import { Registration } from '../registrations/entities/registration.entity';
import { Feedback } from '../feedback/entities/feedback.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      Event,
      Payment,
      Registration,
      Feedback
    ]),
  ],
  providers: [SeedService],
  controllers: [SeedController]
})
export class SeedModule {}
