import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCarDto } from './dto/create-car.dto';
import { UpdateCarDto } from './dto/update-car.dto';

@Injectable()
export class CarService {
  private cars: any = [];

  create(createCarDto: CreateCarDto) {
    const car = {
      id: Date.now().toString(),
      ...createCarDto,
      availability: true,
    };
    this.cars.push(car);
    return car;
  }

  findAll() {
    return this.cars;
  }

  findOne(id: string) {
    const car = this.cars.find(car => car.id === id);
    if (!car) {
      throw new NotFoundException (`car with id ${id} not found`)
    }
    return car;
  }

  update(id: number, updateCarDto: UpdateCarDto) {
    return `This action updates a #${id} car`;
  }

  remove(id: number) {
    return `This action removes a #${id} car`;
  }
}
