import { IsString, IsDateString, IsEnum, IsOptional } from 'class-validator';
import { ContractType } from 'src/common/enum/contract.enum';

export class CreateEmployeeDto {
  @IsString()
  userId: string;

  @IsDateString()
  @IsOptional()
  dateOfBirth: string;

  @IsString()
  @IsOptional()
  address: string;

  @IsString()
  @IsOptional()
  phone: string;

  @IsString()
  @IsOptional()
  department: string;

  @IsString()
  @IsOptional()
  position: string;

  @IsEnum(ContractType)
  @IsOptional()
  contractType: ContractType;

  @IsDateString()
  @IsOptional()
  contractStart: string;

  @IsDateString()
  @IsOptional()
  contractEnd: string;
}
