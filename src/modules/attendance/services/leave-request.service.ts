import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityManager, EntityRepository } from '@mikro-orm/postgresql';
import { Injectable } from '@nestjs/common';
import { Employees } from 'src/common/db/entities/employee.entity';
import { LeaveRequests } from 'src/common/db/entities/leaverequest.entity';
import { EmployeeValidationService } from 'src/modules/employees/services/employee-validation.service';
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
    private readonly employeeValidationService: EmployeeValidationService,
  ) {}

  async create(body: RequestDto): Promise<LeaveRequests> {
    await this.employeeValidationService.validateEmployeeExists(
      body.employeeId,
    );

    this.validationService.validateDateRange(body.startDate, body.endDate);

    // Triggers will handle balance changes
    // - Balance validation
    // - Overlap checking
    // - Balance deduction (if approved)
    const leaveRequest = this.leaveRequestsRepository.create({
      ...body,
      employee: this.em.getReference(Employees, body.employeeId),
    });

    await this.em.persistAndFlush(leaveRequest);
    return leaveRequest;
  }

  async update(id: string, body: Partial<RequestDto>): Promise<LeaveRequests> {
    const leaveRequest =
      await this.validationService.validateLeaveRequestExists(id);

    // Triggers will handle balance changes
    Object.assign(leaveRequest, body);
    await this.em.persistAndFlush(leaveRequest);

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
    await this.employeeValidationService.validateEmployeeExists(employeeId);

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
