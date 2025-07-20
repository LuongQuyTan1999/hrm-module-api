import { PartialType } from '@nestjs/mapped-types';
import {
  IsBoolean,
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { PaginationDto } from 'src/common/dto/pagination.dto';

export enum AdvanceRequestsStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  PAID = 'paid',
}

export class CreateAdvanceRequestsDto {
  @IsString()
  @IsNotEmpty()
  employeeId: string;

  @IsString()
  @IsNotEmpty()
  requestAmount: string;

  @IsEnum(AdvanceRequestsStatus)
  @IsOptional()
  status = AdvanceRequestsStatus.PENDING;

  @IsString()
  @IsNotEmpty()
  reason: string;

  @IsBoolean()
  isUrgent = false;

  @IsString()
  @IsOptional()
  approverId: string;

  @IsDateString()
  @IsOptional()
  dueDate: string;
}

export class UpdateAdvanceRequestsDto extends PartialType(
  CreateAdvanceRequestsDto,
) {}

export class AdvanceRequestsQueryDto extends PaginationDto {
  @IsOptional()
  @IsString()
  employeeId?: string;

  @IsOptional()
  @IsString()
  status?: AdvanceRequestsStatus;

  @IsOptional()
  @IsString()
  periodStart?: string;

  @IsOptional()
  @IsString()
  periodEnd?: string;
}
