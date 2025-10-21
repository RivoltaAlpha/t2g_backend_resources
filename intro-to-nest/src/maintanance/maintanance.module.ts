import { Module } from '@nestjs/common';
import { MaintananceService } from './maintanance.service';
import { MaintananceController } from './maintanance.controller';

@Module({
  controllers: [MaintananceController],
  providers: [MaintananceService],
})
export class MaintananceModule {}
