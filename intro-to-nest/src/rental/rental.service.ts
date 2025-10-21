import { Injectable } from '@nestjs/common';
import { CreateRentalDto } from './dto/create-rental.dto';
import { UpdateRentalDto } from './dto/update-rental.dto';
import { CarService } from 'src/car/car.service';
import { CustomerService } from 'src/customer/customer.service';

@Injectable()
export class RentalService {
  // used for injections 
constructor(
  private readonly carService: CarService,
  private readonly customerService: CustomerService,
){}

 async createRental(createRentalDto: CreateRentalDto) {
  const car = await this.carService.findOne(createRentalDto.car_id);
  const customer = await this.customerService.findOne(createRentalDto.customer_id);

  // business logic
  return {rental: 'created', car, customer}
 }

  create(
    createRentalDto: CreateRentalDto,
  ) {
    return 'This action adds a new rental';
  }

  findAll() {
    return `This action returns all rental`;
  }

  findOne(id: number) {
    return `This action returns a #${id} rental`;
  }

  update(id: number, updateRentalDto: UpdateRentalDto) {
    return `This action updates a #${id} rental`;
  }

  remove(id: number) {
    return `This action removes a #${id} rental`;
  }
}
