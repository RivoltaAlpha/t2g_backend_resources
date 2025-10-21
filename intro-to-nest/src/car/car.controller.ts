import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CarService } from './car.service';
import { CreateCarDto } from './dto/create-car.dto';
import { UpdateCarDto } from './dto/update-car.dto';

@Controller('cars')
export class CarController {
  constructor(private readonly carService: CarService) {}

  @Post('/create')
  create(@Body() createCarDto: CreateCarDto) {
    return this.carService.create(createCarDto);
  }

  @Get('/all')
  findAll() {
    return this.carService.findAll();
  }

  @Get('/car/:id')
  findOne(@Param('id') id: string) {
    return this.carService.findOne(id);
  }

  @Patch('/update/:id')
  update(@Param('id') id: string, @Body() updateCarDto: UpdateCarDto) {
    return this.carService.update(+id, updateCarDto);
  }

  @Delete('/delete/:id')
  remove(@Param('id') id: string) {
    return this.carService.remove(+id);
  }
}
