// src/modules/ai/ai.module.ts
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { Employees } from 'src/common/db/entities/employee.entity';
import { Users } from 'src/common/db/entities/user.entity';
import { AiController } from './ai.controller';
import { AiService } from './ai.service';
import { EmployeesService } from '../employees/employees.service';
import { SqlDatabaseService } from './services/sql-database.service';

@Module({
  imports: [MikroOrmModule.forFeature([Employees, Users])],
  controllers: [AiController],
  providers: [AiService, EmployeesService, SqlDatabaseService],
})
export class AiModule {}
