import {
  IsString,
  IsEnum,
  IsDateString,
  IsOptional,
  IsNumber,
  IsInt,
  IsDate,
  IsIn,
  IsNotEmpty,
} from 'class-validator';

export enum LeaveTypeEnum {
  ANNUAL = 'annual',
  SICK = 'sick',
  CASUAL = 'casual',
  MATERNITY = 'maternity',
  PATERNITY = 'paternity',
  REMOTE = 'remote',
  OTHER = 'other',
}

export enum StatusTypeEnum {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
}

export class RequestDto {
  @IsString()
  @IsNotEmpty()
  employeeId: string;

  @IsEnum(LeaveTypeEnum)
  leaveType: LeaveTypeEnum;

  @IsDateString()
  startDate: string;

  @IsDateString()
  endDate: string;

  @IsString()
  reason: string;

  @IsEnum(StatusTypeEnum)
  status: StatusTypeEnum;

  @IsOptional()
  @IsDate()
  createdAt?: Date;

  @IsOptional()
  @IsDate()
  updatedAt?: Date;
}

export class CreateLeaveBalanceDto {
  @IsString()
  @IsNotEmpty()
  employeeId: string;

  @IsEnum(LeaveTypeEnum)
  leaveType: LeaveTypeEnum;

  @IsNumber()
  balance_days: number;

  @IsInt()
  year: number;

  @IsOptional()
  @IsDate()
  createdAt?: Date;

  @IsOptional()
  @IsDate()
  updatedAt?: Date;
}

export class RecordDto {
  @IsString()
  @IsNotEmpty()
  employeeId: string;

  @IsString()
  @IsNotEmpty()
  shiftId: string;

  @IsDateString()
  checkIn: string;

  @IsOptional()
  @IsDateString()
  checkOut: string | null;

  @IsIn(['checked_in', 'late', 'late_early', 'absent', 'normal'])
  status: 'checked_in' | 'late' | 'late_early' | 'absent' | 'normal';
}
