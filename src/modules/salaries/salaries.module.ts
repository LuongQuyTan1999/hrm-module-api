import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { EmployeeSalaries } from 'src/common/db/entities/employeesalarie.entity';
import { SalaryRules } from 'src/common/db/entities/salaryrule.entity';
import { EmployeesModule } from '../employees/employees.module';
import { SalariesController } from './salaries.controller';
import { SalariesService } from './salaries.service';

@Module({
  imports: [
    MikroOrmModule.forFeature([EmployeeSalaries, SalaryRules]),
    EmployeesModule,
  ],
  controllers: [SalariesController],
  providers: [SalariesService],
})
export class SalariesModule {}
