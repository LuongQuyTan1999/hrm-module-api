import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository } from '@mikro-orm/postgresql';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { LeaveBalances } from 'src/common/db/entities/leavebalance.entity';
import { LeaveRequests } from 'src/common/db/entities/leaverequest.entity';

@Injectable()
export class AttendanceValidationService {
  constructor(
    @InjectRepository(LeaveBalances)
    private readonly leaveBalancesRepository: EntityRepository<LeaveBalances>,
    @InjectRepository(LeaveRequests)
    private readonly leaveRequestsRepository: EntityRepository<LeaveRequests>,
  ) {}

  async validateLeaveRequestExists(id: string): Promise<LeaveRequests> {
    const leaveRequest = await this.leaveRequestsRepository.findOne(
      { id },
      { populate: ['employee'] },
    );

    if (!leaveRequest) {
      throw new NotFoundException(`Leave request with ID ${id} not found`);
    }

    return leaveRequest;
  }

  async validateLeaveBalance(
    employeeId: string,
    leaveType: string,
    daysRequested: number,
  ): Promise<LeaveBalances> {
    const leaveBalance = await this.leaveBalancesRepository.findOne({
      employee: employeeId,
      leaveType,
    });

    if (!leaveBalance) {
      throw new NotFoundException(
        `Leave balance for employee ${employeeId} and leave type ${leaveType} not found`,
      );
    }

    if (Number(leaveBalance.balanceDays) < daysRequested) {
      throw new BadRequestException(
        `Insufficient leave balance. Required: ${daysRequested} days, Available: ${leaveBalance.balanceDays} days`,
      );
    }

    return leaveBalance;
  }

  async validateUniqueLeaveBalance(
    employeeId: string,
    leaveType: string,
  ): Promise<void> {
    const existingBalance = await this.leaveBalancesRepository.findOne({
      employee: employeeId,
      leaveType,
    });

    if (existingBalance) {
      throw new BadRequestException(
        `Leave balance for employee ${employeeId} and leave type ${leaveType} already exists`,
      );
    }
  }

  validateDateRange(startDate: string, endDate: string): void {
    const start = new Date(startDate);
    const end = new Date(endDate);

    if (start > end) {
      throw new BadRequestException('Start date cannot be after end date');
    }

    if (start < new Date()) {
      throw new BadRequestException('Cannot request leave for past dates');
    }
  }
}
