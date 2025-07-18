import { PartialType } from '@nestjs/mapped-types';
import {
  IsDateString,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateSalaryDto {
  @IsString()
  @IsNotEmpty()
  employeeId: string;

  @IsString()
  @IsNotEmpty()
  salaryAmount: string;

  @IsDateString()
  @IsNotEmpty()
  effectiveDate: string;

  @IsDateString()
  @IsOptional()
  endDate?: string;
}

export class UpdateSalaryDto extends PartialType(CreateSalaryDto) {}
