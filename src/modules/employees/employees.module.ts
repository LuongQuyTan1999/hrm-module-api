import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { Employees } from 'src/common/db/entities/employee.entity';
import { Users } from '../../common/db/entities/user.entity';
import { EmployeesController } from './employees.controller';
import { EmployeesService } from './employees.service';

@Module({
  imports: [MikroOrmModule.forFeature([Employees, Users])],
  controllers: [EmployeesController],
  providers: [EmployeesService],
})
export class EmployeesModule {}
