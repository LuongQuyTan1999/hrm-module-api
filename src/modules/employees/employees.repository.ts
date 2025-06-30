import { EntityRepository, FilterQuery } from '@mikro-orm/postgresql';
import { Employees } from 'src/common/db/entities/employee.entity';
import { FindEmployeesDto } from './dto/query.dto';

export class EmployeeRepository extends EntityRepository<Employees> {
  async findPaginated(queryParams: FindEmployeesDto): Promise<{
    items: Employees[];
    total: number;
    page: number;
    pageCount: number;
    limit: number;
  }> {
    const {
      search,
      departmentId,
      positionId,
      role,
      page = 1,
      limit = 10,
    } = queryParams;
    const query: FilterQuery<Employees> = {};
    const userConditions: Record<string, any> = {};

    if (search) {
      userConditions.$or = [
        { firstName: { $ilike: `%${search}%` } },
        { lastName: { $ilike: `%${search}%` } },
        { email: { $ilike: `%${search}%` } },
        { employeeCode: { $ilike: `%${search}%` } },
      ];
    }

    if (role) {
      if (Array.isArray(role)) {
        userConditions.role = { $in: role };
      } else {
        userConditions.role = { $eq: role };
      }
    }

    if (departmentId) {
      query.department = departmentId;
    }

    if (positionId) {
      query.position = positionId;
    }

    const [items, total] = await this.findAndCount(query, {
      populate: ['department', 'position', 'user'],
      limit,
      offset: (page - 1) * limit,
      orderBy: { createdAt: 'DESC' },
    });

    return {
      items,
      total,
      page,
      limit,
      pageCount: Math.ceil(total / limit),
    };
  }
}
