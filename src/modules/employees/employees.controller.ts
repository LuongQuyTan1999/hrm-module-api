import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Req,
} from '@nestjs/common';
import { Roles } from 'src/common/decorators/roles.decorator';
import { User } from 'src/common/decorators/user.decorator';
import { Role } from 'src/common/enum/role.enum';
import { Users } from '../../common/db/entities/user.entity';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { FindEmployeesDto } from './dto/query.dto';
import { EmployeesService } from './employees.service';
import { UpdateEmployeeDto } from './dto/update-employee.dto';

export class ChatDto {
  message: string;
}

@Controller('employees')
export class EmployeesController {
  constructor(private employeesService: EmployeesService) {}

  @Post()
  @Roles(Role.ADMIN)
  async create(@Body() body: CreateEmployeeDto, @Req() req: { user: Users }) {
    return this.employeesService.create(body, req.user);
  }

  @Get()
  @Roles(Role.ADMIN, Role.MANAGER)
  async findAll(@Query() query: FindEmployeesDto) {
    return this.employeesService.findAll(query);
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @User() user: Users) {
    return this.employeesService.findOne(id, user);
  }

  @Put(':id')
  @Roles(Role.ADMIN)
  async update(@Param('id') id: string, @Body() body: UpdateEmployeeDto) {
    return this.employeesService.update(id, body);
  }

  @Delete(':id')
  @Roles(Role.ADMIN)
  async delete(@Param('id') id: string) {
    return this.employeesService.delete(id);
  }

  @Post(':id/create-account')
  @Roles(Role.ADMIN)
  async createUser(
    @Param('id') employeeId: string,
    @Body() body: CreateUserDto,
  ) {
    return this.employeesService.createUser(employeeId, body);
  }
}
