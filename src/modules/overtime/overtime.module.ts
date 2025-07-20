import { Module } from '@nestjs/common';
import { OvertimeService } from './overtime.service';
import { OvertimeController } from './overtime.controller';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Overtime } from 'src/common/db/entities/overtime.entity';
import { Employees } from 'src/common/db/entities/employee.entity';
import { PayrollConfigService } from '../payroll-config/payroll-config.service';
import { ShiftConfigurations } from 'src/common/db/entities/shiftconfiguration.entity';
import { PayrollConfig } from 'src/common/db/entities/payrollconfig.entity';

@Module({
  imports: [
    MikroOrmModule.forFeature([
      Overtime,
      Employees,
      ShiftConfigurations,
      PayrollConfig,
    ]),
  ],
  controllers: [OvertimeController],
  providers: [OvertimeService, PayrollConfigService],
  exports: [OvertimeService],
})
export class OvertimeModule {}
