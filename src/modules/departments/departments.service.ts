// src/modules/departments/departments.service.ts
import { InjectRepository } from '@mikro-orm/nestjs';
import {
  EntityManager,
  EntityRepository,
  FilterQuery,
} from '@mikro-orm/postgresql';
import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Departments } from 'src/common/db/entities/department.entity';
import { Employees } from 'src/common/db/entities/employee.entity';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { CreateDepartmentDto } from './dto/create-department.dto';
import { UpdateDepartmentDto } from './dto/update-department.dto';

@Injectable()
export class DepartmentsService {
  constructor(
    @InjectRepository(Departments)
    private readonly departmentRepository: EntityRepository<Departments>,
    @InjectRepository(Employees)
    private readonly employeeRepository: EntityRepository<Employees>,
    private readonly em: EntityManager,
  ) {}

  async create(body: CreateDepartmentDto): Promise<Departments> {
    // ✅ Check duplicate name
    await this.validateUniqueName(body.name);

    const department = this.departmentRepository.create({
      ...body,
    });

    await this.em.persistAndFlush(department);

    return department;
  }

  async findAll(
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
    const query: FilterQuery<Departments> = {};

    if (name) {
      query.name = { $ilike: `%${name}%` };
    }

    const [items, total] = await this.departmentRepository.findAndCount(query, {
      limit: Math.min(limit, 100),
      offset: (page - 1) * limit,
      orderBy: { name: 'ASC' },
    });

    return {
      items,
      total,
      page: Number(page),
      limit: Number(limit),
      pageCount: Math.ceil(total / limit),
    };
  }

  async findOne(id: string): Promise<Departments> {
    const department = await this.departmentRepository.findOne({ id });

    if (!department) {
      throw new NotFoundException(`Phòng ban với ID '${id}' không tồn tại`);
    }

    return department;
  }

  async findByName(name: string): Promise<Departments | null> {
    return await this.departmentRepository.findOne({ name });
  }

  async update(id: string, body: UpdateDepartmentDto): Promise<Departments> {
    const department = await this.findOne(id);

    if (body.name && body.name !== department.name) {
      await this.validateUniqueName(body.name);
    }

    Object.assign(department, body);

    await this.em.persistAndFlush(department);

    return department;
  }

  async delete(id: string): Promise<{ message: string }> {
    const department = await this.findOne(id);

    await this.validateDepartmentCanBeDeleted(id);

    await this.em.removeAndFlush(department);

    return { message: `Phòng ban '${department.name}' đã được xóa thành công` };
  }

  async getEmployeesByDepartment(departmentId: string): Promise<Employees[]> {
    await this.findOne(departmentId);

    return await this.employeeRepository.find(
      {
        department: departmentId,
      },
      {
        orderBy: { firstName: 'ASC' },
      },
    );
  }

  private async validateUniqueName(name: string): Promise<void> {
    const existingDepartment = await this.departmentRepository.findOne({
      name,
    });

    if (existingDepartment) {
      throw new ConflictException(`Phòng ban với tên '${name}' đã tồn tại`);
    }
  }

  private async validateDepartmentCanBeDeleted(
    departmentId: string,
  ): Promise<void> {
    const employeeCount = await this.employeeRepository.count({
      department: departmentId,
    });

    if (employeeCount > 0) {
      throw new BadRequestException(
        `Không thể xóa phòng ban này vì có ${employeeCount} nhân viên đang thuộc phòng ban. ` +
          `Vui lòng chuyển nhân viên sang phòng ban khác trước khi xóa.`,
      );
    }
  }
}
