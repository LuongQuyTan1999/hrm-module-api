import { Module } from '@nestjs/common';
import { PayrollService } from './payroll.service';
import { PayrollController } from './payroll.controller';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Payroll } from 'src/common/db/entities/payroll.entity';
import { Employees } from 'src/common/db/entities/employee.entity';
import { SalaryRules } from 'src/common/db/entities/salaryrule.entity';
import { Attendance } from 'src/common/db/entities/attendance.entity';
import { ShiftConfigurations } from 'src/common/db/entities/shiftconfiguration.entity';
import { EmployeesModule } from '../employees/employees.module';
import { PayrollDetails } from 'src/common/db/entities/payrolldetail.entity';
import { InsuranceContributions } from 'src/common/db/entities/insurancecontribution.entity';
import { TaxRecords } from 'src/common/db/entities/taxrecord.entity';

@Module({
  imports: [
    MikroOrmModule.forFeature([
      Payroll,
      PayrollDetails,
      Employees,
      SalaryRules,
      Attendance,
      ShiftConfigurations,
      InsuranceContributions,
      TaxRecords,
    ]),
    EmployeesModule,
  ],
  controllers: [PayrollController],
  providers: [PayrollService],
})
export class PayrollModule {}
