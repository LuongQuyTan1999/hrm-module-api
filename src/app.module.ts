import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import databaseConfig from './common/db/database.config';
import { JwtAuthGuard } from './common/guards/jwt-auth.guard';
import { RolesGuard } from './common/guards/roles.guard';
import { AttendanceModule } from './modules/attendance/attendance.module';
import { AuthModule } from './modules/auth/auth.module';
import { DepartmentsModule } from './modules/departments/departments.module';
import { EmployeesModule } from './modules/employees/employees.module';
import { InsuranceModule } from './modules/insurance/insurance.module';
import { PayrollDetailsModule } from './modules/payroll-details/payroll-details.module';
import { PayrollModule } from './modules/payroll/payroll.module';
import { PositionsModule } from './modules/positions/positions.module';
import { SalariesModule } from './modules/salaries/salaries.module';
import { TaxRecordsModule } from './modules/tax-records/tax-records.module';
import { AdvanceRequestsModule } from './modules/advance-requests/advance-requests.module';
import { PayrollConfigModule } from './modules/payroll-config/payroll-config.module';
import { AuditLogsModule } from './modules/audit-logs/audit-logs.module';
import { OvertimeModule } from './modules/overtime/overtime.module';

@Module({
  imports: [
    MikroOrmModule.forRoot(databaseConfig),
    AuthModule,
    EmployeesModule,
    DepartmentsModule,
    PositionsModule,
    AttendanceModule,
    PayrollModule,
    PayrollDetailsModule,
    InsuranceModule,
    TaxRecordsModule,
    SalariesModule,
    AdvanceRequestsModule,
    PayrollConfigModule,
    AuditLogsModule,
    OvertimeModule,
  ],
  providers: [
    { provide: 'APP_GUARD', useClass: JwtAuthGuard },
    { provide: 'APP_GUARD', useClass: RolesGuard },
  ],
})
export class AppModule {}
