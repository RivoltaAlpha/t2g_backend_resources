import { Injectable } from '@nestjs/common';
import { CreateMaintananceDto } from './dto/create-maintanance.dto';
import { UpdateMaintananceDto } from './dto/update-maintanance.dto';

@Injectable()
export class MaintananceService {
  create(createMaintananceDto: CreateMaintananceDto) {
    return 'This action adds a new maintanance';
  }

  findAll() {
    return `This action returns all maintanance`;
  }

  findOne(id: number) {
    return `This action returns a #${id} maintanance`;
  }

  update(id: number, updateMaintananceDto: UpdateMaintananceDto) {
    return `This action updates a #${id} maintanance`;
  }

  remove(id: number) {
    return `This action removes a #${id} maintanance`;
  }
}
