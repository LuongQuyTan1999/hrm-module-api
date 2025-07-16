import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { AdvanceRequests } from 'src/common/db/entities/advancerequest.entity';
import { Attendance } from 'src/common/db/entities/attendance.entity';
import { Employees } from 'src/common/db/entities/employee.entity';
import { InsuranceContributions } from 'src/common/db/entities/insurancecontribution.entity';
import { Payroll } from 'src/common/db/entities/payroll.entity';
import { PayrollDetails } from 'src/common/db/entities/payrolldetail.entity';
import { SalaryRules } from 'src/common/db/entities/salaryrule.entity';
import { ShiftConfigurations } from 'src/common/db/entities/shiftconfiguration.entity';
import { TaxRecords } from 'src/common/db/entities/taxrecord.entity';
import { EmployeesModule } from '../employees/employees.module';
import { PayrollController } from './payroll.controller';
import { PayrollService } from './payroll.service';
import { AdvanceRequestsService } from './services/advance-requests.service';
import { Users } from 'src/common/db/entities/user.entity';
import { EmployeesService } from '../employees/employees.service';

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
      AdvanceRequests,
      Users,
    ]),
    EmployeesModule,
  ],
  controllers: [PayrollController],
  providers: [PayrollService, AdvanceRequestsService, EmployeesService],
})
export class PayrollModule {}
