import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { AdvanceRequests } from 'src/common/db/entities/advancerequest.entity';
import { Employees } from 'src/common/db/entities/employee.entity';
import { EmployeeBenefits } from 'src/common/db/entities/employeebenefit.entity';
import { EmployeeSalaries } from 'src/common/db/entities/employeesalarie.entity';
import { InsuranceContributions } from 'src/common/db/entities/insurancecontribution.entity';
import { Overtime } from 'src/common/db/entities/overtime.entity';
import { Payroll } from 'src/common/db/entities/payroll.entity';
import { PayrollConfig } from 'src/common/db/entities/payrollconfig.entity';
import { PayrollDetails } from 'src/common/db/entities/payrolldetail.entity';
import { SalaryRules } from 'src/common/db/entities/salaryrule.entity';
import { ShiftConfigurations } from 'src/common/db/entities/shiftconfiguration.entity';
import { TaxRecords } from 'src/common/db/entities/taxrecord.entity';
import { AdvanceRequestsService } from '../advance-requests/advance-requests.service';
import { EmployeesModule } from '../employees/employees.module';
import { InsuranceService } from '../insurance/insurance.service';
import { OvertimeService } from '../overtime/overtime.service';
import { PayrollConfigService } from '../payroll-config/payroll-config.service';
import { SalariesService } from '../salaries/salaries.service';
import { TaxRecordsService } from '../tax-records/tax-records.service';
import { PayrollController } from './payroll.controller';
import { PayrollService } from './payroll.service';
import { PayrollCalculatorService } from './services/payroll-calculator.service';

@Module({
  imports: [
    MikroOrmModule.forFeature([
      Payroll,
      PayrollDetails,
      Employees,
      SalaryRules,
      ShiftConfigurations,
      InsuranceContributions,
      TaxRecords,
      AdvanceRequests,
      EmployeeSalaries,
      EmployeeBenefits,
      PayrollConfig,
      Overtime,
    ]),
    EmployeesModule,
  ],
  controllers: [PayrollController],
  providers: [
    PayrollService,
    AdvanceRequestsService,
    SalariesService,
    InsuranceService,
    TaxRecordsService,
    PayrollCalculatorService,
    PayrollConfigService,
    OvertimeService,
  ],
  exports: [PayrollService],
})
export class PayrollModule {}
