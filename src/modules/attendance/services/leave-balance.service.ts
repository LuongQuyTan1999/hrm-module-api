import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityManager, EntityRepository } from '@mikro-orm/postgresql';
import { Injectable } from '@nestjs/common';
import { Employees } from 'src/common/db/entities/employee.entity';
import { LeaveBalances } from 'src/common/db/entities/leavebalance.entity';
import { EmployeesService } from 'src/modules/employees/employees.service';
import { CreateLeaveBalanceDto } from '../dto/attendance.dto';
import { AttendanceValidationService } from './attendance-validation.service';

@Injectable()
export class LeaveBalanceService {
  constructor(
    @InjectRepository(LeaveBalances)
    private readonly leaveBalancesRepository: EntityRepository<LeaveBalances>,
    private readonly em: EntityManager,
    private readonly validationService: AttendanceValidationService,
    private readonly employeesSer: EmployeesService,
  ) {}

  async create(body: CreateLeaveBalanceDto): Promise<LeaveBalances> {
    await this.employeesSer.findOne(body.employeeId);

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
    await this.employeesSer.findOne(employeeId);

    const leaveBalances = await this.leaveBalancesRepository.find({
      employee: employeeId,
    });

    return leaveBalances;
  }
}
