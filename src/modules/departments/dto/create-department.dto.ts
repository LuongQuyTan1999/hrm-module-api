import { IsString } from 'class-validator';

export class CreateDepartmentDto {
  @IsString()
  name: string;

  @IsString()
  description: string;

  @IsString()
  color: string;

  @IsString()
  managerName: string;

  @IsString()
  managerEmail: string;
}
