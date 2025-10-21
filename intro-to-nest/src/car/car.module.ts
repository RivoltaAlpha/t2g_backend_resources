import { Module } from '@nestjs/common';
import { CarService } from './car.service';
import { CarController } from './car.controller';

@Module({
  imports: [],
  controllers: [CarController],
  providers: [CarService],
  exports: [CarService]
})
export class CarModule {}
