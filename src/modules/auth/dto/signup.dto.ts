import { IsEmail, IsEnum, IsString, MinLength } from 'class-validator';
import { Role } from 'src/common/enum/role.enum';

export class SignupDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;

  @IsString()
  fullName: string;

  @IsEnum(Role)
  role: Role;
}
