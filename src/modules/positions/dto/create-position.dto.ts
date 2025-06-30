import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';

export class CreatePositionDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsString()
  @IsUUID()
  departmentId: string;

  @IsNumber()
  minSalary: number;

  @IsNumber()
  maxSalary: number;

  @IsString()
  level: string; // e.g., 'Junior', 'Mid', 'Senior', 'Lead', 'Manager', 'Director';
}
