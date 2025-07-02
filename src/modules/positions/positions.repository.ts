import { EntityRepository } from '@mikro-orm/postgresql';
import { NotFoundException } from '@nestjs/common';
import { Positions } from 'src/common/db/entities/position.entity';
import { PaginationDto } from 'src/common/dto/pagination.dto';

export class PositionsRepository extends EntityRepository<Positions> {
  async findAllAndPaginate(
    queryParams: {
      name?: string;
    } & PaginationDto,
  ): Promise<{
    items: Positions[];
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

    const query = `
      SELECT
        p.*,
        CASE
          WHEN d.id IS NOT NULL THEN JSON_BUILD_OBJECT(
            'id', d.id,
            'name', d.name,
            'description', d.description,
            'color', d.color
          )
          ELSE NULL
        END as department,
        COUNT(e.id)::int as employee_count
      FROM positions p
      LEFT JOIN departments d ON p.department_id = d.id
      LEFT JOIN employees e ON p.id = e.position_id 
      ${whereClause}
      GROUP BY p.id, d.id 
      ORDER BY p.name ASC 
      LIMIT ? OFFSET ?
    `;

    const countQuery = `SELECT COUNT(DISTINCT p.id)::int as total FROM positions p ${whereClause}`;

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
        department: item.department,
        employeeCount: item.employee_count,
        level: item.level,
        minSalary: item.min_salary,
        maxSalary: item.max_salary,
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
  ): Promise<Positions & { employeeCount: number }> {
    const query = `
      SELECT
        p.*,
        CASE
          WHEN d.id IS NOT NULL THEN JSON_BUILD_OBJECT(
            'id', d.id,
            'name', d.name,
            'description', d.description,
            'color', d.color
          )
          ELSE NULL
        END as department,
        COUNT(e.id)::int as employee_count
      FROM positions p
      LEFT JOIN departments d ON p.department_id = d.id
      LEFT JOIN employees e ON p.id = e.position_id 
      WHERE d.id = ?
      GROUP BY d.id
    `;

    const result = await this.em.getConnection().execute(query, [id]);

    if (!result || result.length === 0) {
      throw new NotFoundException(`Phòng ban với ID '${id}' không tồn tại`);
    }

    const position = result[0];

    return {
      id: position.id,
      name: position.name,
      description: position.description,
      department: position.department,
      employeeCount: position.employee_count,
      createdAt: position.created_at,
      updatedAt: position.updated_at,
    };
  }
}
