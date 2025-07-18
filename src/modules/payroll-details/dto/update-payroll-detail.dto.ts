import { PartialType } from '@nestjs/mapped-types';
import { CreatePayrollDetailDto } from './create-payroll-detail.dto';

export class UpdatePayrollDetailDto extends PartialType(CreatePayrollDetailDto) {}
