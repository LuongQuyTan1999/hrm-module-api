import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityManager, EntityRepository } from '@mikro-orm/postgresql';
import { Employees } from 'src/common/db/entities/employee.entity';
import { LeaveBalances } from 'src/common/db/entities/leavebalance.entity';
import { CreateLeaveBalanceDto } from '../dto/attendance.dto';
import { AttendanceValidationService } from './attendance-validation.service';
import { EmployeeValidationService } from 'src/modules/employees/services/employee-validation.service';

@Injectable()
export class LeaveBalanceService {
  constructor(
    @InjectRepository(LeaveBalances)
    private readonly leaveBalancesRepository: EntityRepository<LeaveBalances>,
    private readonly em: EntityManager,
    private readonly validationService: AttendanceValidationService,
    private readonly employeeValidationService: EmployeeValidationService,
  ) {}

  async create(body: CreateLeaveBalanceDto): Promise<LeaveBalances> {
    await this.employeeValidationService.validateEmployeeExists(
      body.employeeId,
    );

    await this.validationService.validateUniqueLeaveBalance(
      body.employeeId,
      body.leaveType,
    );

    const leaveBalance = this.leaveBalancesRepository.create({
      ...body,
      employee: this.em.getReference(Employees, body.employeeId),
    });

    await this.em.persistAndFlush(leaveBalance);
    return leaveBalance;
  }

  async getByEmployeeId(employeeId: string): Promise<LeaveBalances[]> {
    await this.employeeValidationService.validateEmployeeExists(employeeId);

    const leaveBalances = await this.leaveBalancesRepository.find({
      employee: employeeId,
    });

    return leaveBalances;
  }

  async deductBalance(
    employeeId: string,
    leaveType: string,
    days: number,
  ): Promise<LeaveBalances> {
    const leaveBalance = await this.validationService.validateLeaveBalance(
      employeeId,
      leaveType,
      days,
    );

    leaveBalance.balanceDays = String(Number(leaveBalance.balanceDays) - days);

    await this.em.persistAndFlush(leaveBalance);
    return leaveBalance;
  }

  async restoreBalance(
    employeeId: string,
    leaveType: string,
    days: number,
  ): Promise<LeaveBalances> {
    const leaveBalance = await this.leaveBalancesRepository.findOne({
      employee: employeeId,
      leaveType,
    });

    if (!leaveBalance) {
      throw new Error(
        `Leave balance not found for employee ${employeeId} and leave type ${leaveType}`,
      );
    }

    leaveBalance.balanceDays = String(Number(leaveBalance.balanceDays) + days);
    await this.em.persistAndFlush(leaveBalance);

    return leaveBalance;
  }
}
