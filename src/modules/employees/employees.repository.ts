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
    const { search, department, role, page = 1, limit = 10 } = queryParams;
    const query: FilterQuery<Employees> = {};
    const userConditions: Record<string, any> = {};

    if (search) {
      userConditions.fullName = { $ilike: `%${search}%` };
    }

    if (role) {
      userConditions.role = { $eq: role };
    }

    if (Object.keys(userConditions).length > 0) {
      query.user = userConditions;
    }

    if (department) {
      query.department = { $ilike: `%${department}%` };
    }

    const [items, total] = await this.findAndCount(query, {
      populate: ['user'],
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
