import { IsEnum, IsOptional, IsString, MaxLength } from 'class-validator';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { Role } from 'src/common/enum/role.enum';

export class FindEmployeesDto extends PaginationDto {
  @IsOptional()
  @IsString()
  @MaxLength(100)
  search?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  departmentId?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  positionId?: string;

  @IsOptional()
  @IsEnum(Role)
  role?: string;
}
