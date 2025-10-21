import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { MaintananceService } from './maintanance.service';
import { CreateMaintananceDto } from './dto/create-maintanance.dto';
import { UpdateMaintananceDto } from './dto/update-maintanance.dto';

@Controller('maintanance')
export class MaintananceController {
  constructor(private readonly maintananceService: MaintananceService) {}

  @Post()
  create(@Body() createMaintananceDto: CreateMaintananceDto) {
    return this.maintananceService.create(createMaintananceDto);
  }

  @Get()
  findAll() {
    return this.maintananceService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.maintananceService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateMaintananceDto: UpdateMaintananceDto) {
    return this.maintananceService.update(+id, updateMaintananceDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.maintananceService.remove(+id);
  }
}
