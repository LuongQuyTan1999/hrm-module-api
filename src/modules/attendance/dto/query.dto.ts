import { IsArray, IsOptional, IsString } from 'class-validator';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { LeaveTypeEnum, StatusTypeEnum } from './attendance.dto';

export class AttendanceQueryDto extends PaginationDto {
  @IsOptional()
  @IsString()
  status?: StatusTypeEnum;

  @IsOptional()
  @IsString()
  leaveType?: LeaveTypeEnum;

  @IsOptional()
  @IsString()
  employeeId?: string;

  @IsOptional()
  @IsArray()
  excludeLeaveTypes?: LeaveTypeEnum[];
}
