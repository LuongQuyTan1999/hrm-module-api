import { IsString, IsDateString, IsEnum, IsOptional } from 'class-validator';
import { ContractType } from 'src/common/enum/contract.enum';

export class CreateEmployeeDto {
  @IsString()
  user_id: string;

  @IsDateString()
  @IsOptional()
  date_of_birth: string;

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
  contract_type: ContractType;

  @IsDateString()
  @IsOptional()
  contract_start: string;

  @IsDateString()
  @IsOptional()
  contract_end: string;
}
