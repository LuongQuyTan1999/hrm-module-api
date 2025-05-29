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
import { Role } from 'src/common/enum/role.enum';
import { Roles } from 'src/common/decorators/roles.decorator';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { EmployeesService } from './employees.service';
import { Users } from '../../common/db/entities/user.entity';
import { User } from 'src/common/decorators/user.decorator';
import { FindEmployeesDto } from './dto/query.dto';

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
  async update(@Param('id') id: string, @Body() body: CreateEmployeeDto) {
    return this.employeesService.update(id, body);
  }

  @Delete(':id')
  @Roles(Role.ADMIN)
  async delete(@Param('id') id: string) {
    return this.employeesService.delete(id);
  }
}
