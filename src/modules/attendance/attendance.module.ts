import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { Attendance } from 'src/common/db/entities/attendance.entity';
import { AuditLogs } from 'src/common/db/entities/auditlog.entity';
import { Employees } from 'src/common/db/entities/employee.entity';
import { LeaveBalances } from 'src/common/db/entities/leavebalance.entity';
import { LeaveRequests } from 'src/common/db/entities/leaverequest.entity';
import { EmployeesModule } from '../employees/employees.module';
import { AttendanceController } from './attendance.controller';
import { AttendanceService } from './attendance.service';
import { AttendanceValidationService } from './services/attendance-validation.service';
import { LeaveBalanceService } from './services/leave-balance.service';
import { LeaveRequestService } from './services/leave-request.service';
import { RecordService } from './services/record.service';

@Module({
  imports: [
    MikroOrmModule.forFeature([
      LeaveBalances,
      LeaveRequests,
      Employees,
      Attendance,
      AuditLogs,
    ]),
    EmployeesModule,
  ],
  controllers: [AttendanceController],
  providers: [
    AttendanceService,
    AttendanceValidationService,
    LeaveBalanceService,
    LeaveRequestService,
    RecordService,
  ],
})
export class AttendanceModule {}
