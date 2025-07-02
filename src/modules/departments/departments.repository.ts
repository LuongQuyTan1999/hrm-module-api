import { EntityRepository } from '@mikro-orm/postgresql';
import { NotFoundException } from '@nestjs/common';
import { Departments } from 'src/common/db/entities/department.entity';
import { PaginationDto } from 'src/common/dto/pagination.dto';

export class DepartmentsRepository extends EntityRepository<Departments> {
  async findAllAndPaginate(
    queryParams: {
      name?: string;
    } & PaginationDto,
  ): Promise<{
    items: Departments[];
    total: number;
    page: number;
    limit: number;
    pageCount: number;
  }> {
    const { name, page = 1, limit = 10 } = queryParams;
    let whereClause = '';
    const offset = (page - 1) * limit;
    const params: any[] = [];

    if (name) {
      whereClause = 'WHERE d.name ILIKE ?';
      params.push(`%${name}%`);
    }

    const query = `SELECT d.*, COUNT(e.id)::int as employee_count FROM departments d LEFT JOIN employees e ON d.id = e.department_id ${whereClause} GROUP BY d.id ORDER BY d.name ASC LIMIT ? OFFSET ?`;

    const countQuery = `SELECT COUNT(DISTINCT d.id)::int as total FROM departments d ${whereClause}`;

    params.push(limit, offset);

    const [items, total] = await Promise.all([
      this.em.getConnection().execute(query, params),
      this.em.getConnection().execute(countQuery, params.slice(0, -2)),
    ]);

    return {
      items: items.map((item) => ({
        id: item.id,
        name: item.name,
        description: item.description,
        color: item.color,
        managerName: item.manager_name,
        managerEmail: item.manager_email,
        employeeCount: item.employee_count,
        createdAt: item.created_at,
        updatedAt: item.updated_at,
      })),
      total: total[0].total,
      page,
      limit,
      pageCount: Math.ceil(total[0].total / limit),
    };
  }

  async findOneWithEmployeeCount(
    id: string,
  ): Promise<Departments & { employeeCount: number }> {
    const query = `
      SELECT d.*, COUNT(e.id)::int as employee_count
      FROM departments d
      LEFT JOIN employees e ON d.id = e.department_id
      WHERE d.id = ?
      GROUP BY d.id
    `;

    const result = await this.em.getConnection().execute(query, [id]);

    if (!result || result.length === 0) {
      throw new NotFoundException(`Phòng ban với ID '${id}' không tồn tại`);
    }

    const department = result[0];

    return {
      id: department.id,
      name: department.name,
      description: department.description,
      color: department.color,
      employeeCount: department.employee_count,
      managerName: department.manager_name,
      managerEmail: department.manager_email,
      createdAt: department.created_at,
      updatedAt: department.updated_at,
    };
  }
}
