import { PartialType } from '@nestjs/mapped-types';

export class CreatePayrollConfigDto {}

export class UpdatePayrollConfigDto extends PartialType(
  CreatePayrollConfigDto,
) {}
