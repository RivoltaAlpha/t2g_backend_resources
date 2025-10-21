import { Module } from '@nestjs/common';
import { RentalService } from './rental.service';
import { RentalController } from './rental.controller';
import { CustomerService } from 'src/customer/customer.service';
import { CarService } from 'src/car/car.service';

@Module({
  imports: [CustomerService, CarService], // import modules of the services you need
  controllers: [RentalController],
  providers: [RentalService],
  exports: [RentalService] // export your service for other modules to use
})
export class RentalModule {}
