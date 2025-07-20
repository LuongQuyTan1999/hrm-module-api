import { PartialType } from '@nestjs/mapped-types';

export class CreateOvertimeDto {}

export class UpdateOvertimeDto extends PartialType(CreateOvertimeDto) {}
