import { IsArray, IsOptional, IsString } from 'class-validator';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { LeaveType, StatusType } from './attendance.dto';

export class AttendanceQueryDto extends PaginationDto {
  @IsOptional()
  @IsString()
  status?: StatusType;

  @IsOptional()
  @IsString()
  leaveType?: LeaveType;

  @IsOptional()
  @IsString()
  employeeId?: string;

  @IsOptional()
  @IsArray()
  excludeLeaveTypes?: LeaveType[];
}
