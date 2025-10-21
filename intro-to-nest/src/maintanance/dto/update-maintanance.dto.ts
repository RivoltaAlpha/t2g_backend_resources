import { PartialType } from '@nestjs/mapped-types';
import { CreateMaintananceDto } from './create-maintanance.dto';

export class UpdateMaintananceDto extends PartialType(CreateMaintananceDto) {}
