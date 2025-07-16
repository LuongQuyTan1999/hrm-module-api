import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityManager, EntityRepository } from '@mikro-orm/postgresql';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { AdvanceRequests } from 'src/common/db/entities/advancerequest.entity';
import {
  AdvanceRequestsQueryDto,
  CreateAdvanceRequestsDto,
  UpdateAdvanceRequestsDto,
} from '../dto/advance-requests.dto';
import { Employees } from 'src/common/db/entities/employee.entity';
import { EmployeeValidationService } from 'src/modules/employees/services/employee-validation.service';
import { Users } from 'src/common/db/entities/user.entity';
import { EmployeesService } from 'src/modules/employees/employees.service';

@Injectable()
export class AdvanceRequestsService {
  constructor(
    @InjectRepository(AdvanceRequests)
    private readonly advanceRequestsRepository: EntityRepository<AdvanceRequests>,
    private readonly employeeValidationService: EmployeeValidationService,
    private readonly employeeService: EmployeesService,
    private readonly em: EntityManager,
  ) {}

  async getAdvanceRequests(query: AdvanceRequestsQueryDto): Promise<{
    items: AdvanceRequests[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    const { page = 1, limit = 10, employeeId } = query;
    const filters: Record<string, any> = {};

    const qb = this.advanceRequestsRepository
      .createQueryBuilder('ad')
      .leftJoinAndSelect('ad.employee', 'e')
      .leftJoinAndSelect('e.department', 'd')
      .leftJoinAndSelect('e.position', 'p')
      .leftJoinAndSelect('ad.approver', 'apr')
      .orderBy({ 'ad.updatedAt': 'DESC' });

    if (employeeId) {
      filters['ad.employee'] = employeeId;
    }

    if (Object.keys(filters).length > 0) {
      qb.andWhere(filters);
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
      await this.employeeValidationService.validateEmployeeExists(
        body.employeeId,
      );

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

      const employee = await this.employeeService.findEmployeeByUserId(
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

  async getTotalAdvanceAmountByEmployeeId(employeeId): Promise<number> {
    const advances = await this.getAdvanceRequests({ employeeId });

    const total = advances.items.reduce(
      (sum, ad) => (sum += Number(ad.requestAmount)),
      0,
    );

    console.log({ advances });
    return total;
  }
}
