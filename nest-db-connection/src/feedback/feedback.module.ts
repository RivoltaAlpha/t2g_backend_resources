import { Module } from '@nestjs/common';
import { FeedbackService } from './feedback.service';
import { FeedbackController } from './feedback.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';
import { Feedback } from './entities/feedback.entity';
import { Event } from '../events/entities/event.entity';

@Module({
    imports: [TypeOrmModule.forFeature([User, Feedback, Event])],
  controllers: [FeedbackController],
  providers: [FeedbackService],
  exports: [FeedbackService],
})
export class FeedbackModule {}
