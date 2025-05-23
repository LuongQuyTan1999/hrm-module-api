import { Body, Controller, Post, Req } from '@nestjs/common';
import { Role } from 'src/common/enum/role.enum';
import { Roles } from 'src/common/decorators/roles.decorator';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { EmployeesService } from './employees.service';
import { User } from '../auth/entities/user.entity';

@Controller('employees')
export class EmployeesController {
  constructor(private employeesService: EmployeesService) {}

  @Post()
  @Roles(Role.ADMIN)
  async create(
    @Body() createEmployeeDto: CreateEmployeeDto,
    @Req() req: { user: User },
  ) {
    return this.employeesService.create(createEmployeeDto, req.user);
  }
}
