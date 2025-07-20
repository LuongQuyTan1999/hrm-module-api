import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityManager, EntityRepository } from '@mikro-orm/postgresql';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Employees } from 'src/common/db/entities/employee.entity';
import { Overtime } from 'src/common/db/entities/overtime.entity';
import { ShiftConfigurations } from 'src/common/db/entities/shiftconfiguration.entity';
import { PayrollConfigService } from '../payroll-config/payroll-config.service';

@Injectable()
export class OvertimeService {
  constructor(
    @InjectRepository(Overtime)
    private readonly overtimeRep: EntityRepository<Overtime>,
    @InjectRepository(ShiftConfigurations)
    private readonly shiftConfigurationRep: EntityRepository<ShiftConfigurations>,

    private readonly em: EntityManager,
    private readonly payrollConfigSer: PayrollConfigService,
  ) {}

  async getOvertimeByEmployeeId(
    employeeId: string,
    periodStart: string,
    periodEnd: string,
  ): Promise<Overtime[]> {
    try {
      const overtime = await this.overtimeRep.find({
        employee: this.em.getReference(Employees, employeeId),
        createdAt: { $gte: periodStart, $lte: periodEnd },
      });

      if (!overtime) {
        throw new NotFoundException(`Can't not find Overtime value`);
      }

      return overtime;
    } catch (error) {
      throw new BadRequestException(`Error: ${error.message}`);
    }
  }

  async calculateOvertimeSalary(
    employeeId: string,
    periodStart: string,
    periodEnd: string,
  ): Promise<number> {
    try {
      const overtimeRecords = await this.getOvertimeByEmployeeId(
        employeeId,
        periodStart,
        periodEnd,
      );

      const config = await this.payrollConfigSer.getPayrollConfig(periodEnd);
      let overtimeSalary = 0;

      for (const record of overtimeRecords) {
        const shift = await this.shiftConfigurationRep.findOne({
          id: record.shift?.id,
        });
        const isHoliday = false;
        const multiplier = isHoliday
          ? config.holidayOvertimeMultiplier
          : shift?.overtimeMultiplier || 1.5;

        overtimeSalary +=
          (Number(record.overtimeHours) || 0) *
          Number(config.overtimeBaseRate) *
          Number(multiplier);
      }

      return overtimeSalary;
    } catch (error) {
      throw new BadRequestException(`Error: ${error.message}`);
    }
  }
}
