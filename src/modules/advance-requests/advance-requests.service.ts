import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityManager, EntityRepository } from '@mikro-orm/postgresql';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { AdvanceRequests } from 'src/common/db/entities/advancerequest.entity';
import { Employees } from 'src/common/db/entities/employee.entity';
import { Users } from 'src/common/db/entities/user.entity';
import { EmployeesService } from 'src/modules/employees/employees.service';
import {
  AdvanceRequestsQueryDto,
  CreateAdvanceRequestsDto,
  UpdateAdvanceRequestsDto,
} from './dto/advance-request.dto';

@Injectable()
export class AdvanceRequestsService {
  constructor(
    @InjectRepository(AdvanceRequests)
    private readonly advanceRequestsRepository: EntityRepository<AdvanceRequests>,
    private readonly employeesSer: EmployeesService,
    private readonly em: EntityManager,
  ) {}

  async getAdvanceRequests(query: AdvanceRequestsQueryDto): Promise<{
    items: AdvanceRequests[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    const {
      page = 1,
      limit = 10,
      employeeId,
      periodStart,
      periodEnd,
      status,
    } = query;

    const qb = this.advanceRequestsRepository
      .createQueryBuilder('ad')
      .leftJoinAndSelect('ad.employee', 'e')
      .leftJoinAndSelect('e.department', 'd')
      .leftJoinAndSelect('e.position', 'p')
      .leftJoinAndSelect('ad.approver', 'apr')
      .orderBy({ 'ad.updatedAt': 'DESC' });

    if (employeeId) {
      qb.andWhere({ 'ad.employee': employeeId });
    }

    if (status) {
      qb.andWhere({ 'ad.status': status });
    }

    if (periodStart) {
      qb.andWhere({ 'ad.requestDate': { $gte: periodStart } });
    }

    if (periodEnd) {
      qb.andWhere({ 'ad.requestDate': { $lte: periodEnd } });
    }

    const offset = (page - 1) * limit;
    qb.offset(offset).limit(limit);

    const [items, total] = await qb.getResultAndCount();

    return {
      items,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async create(body: CreateAdvanceRequestsDto): Promise<AdvanceRequests> {
    try {
      await this.employeesSer.findOne(body.employeeId);

      const advance = this.advanceRequestsRepository.create({
        employee: this.em.getReference(Employees, body.employeeId),
        ...body,
      });

      await this.em.persistAndFlush(advance);

      return advance;
    } catch (error) {
      throw new BadRequestException(
        `Error when creating Advance Requests: ${error.message}`,
      );
    }
  }

  async update(
    id: string,
    body: UpdateAdvanceRequestsDto,
    currentUser: Users,
  ): Promise<AdvanceRequests> {
    try {
      const advance = await this.advanceRequestsRepository.findOne(id);

      if (!advance) {
        throw new NotFoundException('Advance Requests do not exist');
      }

      const employee = await this.employeesSer.findEmployeeByUserId(
        currentUser.id,
      );

      Object.assign(advance, {
        ...body,
        approver: employee,
      });

      await this.em.persistAndFlush(advance);

      return advance;
    } catch (error) {
      throw new BadRequestException(
        `Error when updating Advance Requests: ${error.message}`,
      );
    }
  }

  async getTotalAdvanceAmountByEmployeeId(
    employeeId,
    periodStart,
    periodEnd,
  ): Promise<number> {
    const advances = await this.getAdvanceRequests({
      employeeId,
      periodStart,
      periodEnd,
    });

    const total = advances.items.reduce(
      (sum, ad) => (sum += Number(ad.requestAmount)),
      0,
    );

    return total;
  }
}
