import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { Roles } from 'src/common/decorators/roles.decorator';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { Role } from 'src/common/enum/role.enum';
import { DepartmentsService } from './departments.service';
import { CreateDepartmentDto } from './dto/create-department.dto';
import { UpdateDepartmentDto } from './dto/update-department.dto';

@Controller('departments')
@Roles(Role.ADMIN)
export class DepartmentsController {
  constructor(private readonly departmentsService: DepartmentsService) {}

  @Post()
  create(@Body() body: CreateDepartmentDto) {
    return this.departmentsService.create(body);
  }

  @Get()
  findAll(@Query() query: { name?: string } & PaginationDto) {
    return this.departmentsService.findAll(query);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() body: UpdateDepartmentDto) {
    return this.departmentsService.update(id, body);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.departmentsService.delete(id);
  }
}
