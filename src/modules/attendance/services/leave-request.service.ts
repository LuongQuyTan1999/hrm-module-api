import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityManager, EntityRepository } from '@mikro-orm/postgresql';
import { Injectable } from '@nestjs/common';
import { Employees } from 'src/common/db/entities/employee.entity';
import { LeaveRequests } from 'src/common/db/entities/leaverequest.entity';
import { EmployeesService } from 'src/modules/employees/employees.service';
import { RequestDto } from '../dto/attendance.dto';
import { AttendanceQueryDto } from '../dto/query.dto';
import { AttendanceValidationService } from './attendance-validation.service';

@Injectable()
export class LeaveRequestService {
  constructor(
    @InjectRepository(LeaveRequests)
    private readonly leaveRequestsRepository: EntityRepository<LeaveRequests>,
    private readonly em: EntityManager,
    private readonly validationService: AttendanceValidationService,
    private readonly employeesSer: EmployeesService,
  ) {}

  async create(body: RequestDto): Promise<LeaveRequests> {
    await this.employeesSer.findOne(body.employeeId);

    this.validationService.validateDateRange(body.startDate, body.endDate);

    const leaveRequest = this.leaveRequestsRepository.create({
      ...body,
      employee: this.em.getReference(Employees, body.employeeId),
    });

    // Before creating, will trigger DB to check balance and overlaps
    // Check in validate_leave_request_balance_trigger_v2 and check_leave_overlap_trigger_v2 triggers
    await this.em.persistAndFlush(leaveRequest);
    // After creating, the triggers will handle balance changes
    // Check in attendance_after_update_v2 trigger

    return leaveRequest;
  }

  async update(id: string, body: Partial<RequestDto>): Promise<LeaveRequests> {
    const leaveRequest =
      await this.validationService.validateLeaveRequestExists(id);

    Object.assign(leaveRequest, body);

    await this.em.persistAndFlush(leaveRequest);
    // After creating, the triggers will handle balance changes
    // Check in attendance_after_update_v2 trigger

    return leaveRequest;
  }

  async findAll(queryParams: AttendanceQueryDto): Promise<{
    items: LeaveRequests[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    const {
      page = 1,
      limit = 10,
      status,
      leaveType,
      employeeId,
      excludeLeaveTypes,
    } = queryParams;
    const filters: Record<string, any> = {};

    const queryBuilder = this.leaveRequestsRepository
      .createQueryBuilder('lr')
      .leftJoinAndSelect('lr.employee', 'e')
      .leftJoinAndSelect('e.position', 'p')
      .leftJoinAndSelect('e.department', 'd')
      .leftJoinAndSelect('lr.approver', 'a')
      .orderBy({ 'lr.updatedAt': 'DESC' });

    if (employeeId) {
      filters['lr.employee'] = employeeId;
    }

    if (status) {
      filters['lr.status'] = status;
    }

    if (leaveType) {
      filters['lr.leaveType'] = leaveType;
    }

    if (excludeLeaveTypes && excludeLeaveTypes.length > 0) {
      queryBuilder.andWhere({
        'lr.leaveType': { $nin: excludeLeaveTypes },
      });
    }

    if (Object.keys(filters).length > 0) {
      queryBuilder.andWhere(filters);
    }

    const offset = (page - 1) * limit;
    queryBuilder.offset(offset).limit(limit);

    const [items, total] = await queryBuilder.getResultAndCount();

    return {
      items,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findByEmployee(employeeId: string): Promise<LeaveRequests[]> {
    await this.employeesSer.findOne(employeeId);

    return await this.leaveRequestsRepository.find(
      { employee: employeeId },
      {
        populate: ['approver'],
        orderBy: { updatedAt: 'DESC' },
      },
    );
  }

  async findById(id: string): Promise<LeaveRequests> {
    return await this.validationService.validateLeaveRequestExists(id);
  }
}
