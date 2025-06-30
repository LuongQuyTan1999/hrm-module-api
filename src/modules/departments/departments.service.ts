// src/modules/departments/departments.service.ts
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityManager, EntityRepository } from '@mikro-orm/postgresql';
import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';
import { Departments } from 'src/common/db/entities/department.entity';
import { Employees } from 'src/common/db/entities/employee.entity';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { DepartmentsRepository } from './departments.repository';
import { CreateDepartmentDto } from './dto/create-department.dto';
import { UpdateDepartmentDto } from './dto/update-department.dto';

@Injectable()
export class DepartmentsService {
  constructor(
    @InjectRepository(Departments)
    private readonly departmentRepository: DepartmentsRepository,
    @InjectRepository(Employees)
    private readonly employeeRepository: EntityRepository<Employees>,
    private readonly em: EntityManager,
  ) {}

  async create(body: CreateDepartmentDto): Promise<Departments> {
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
    const departments =
      await this.departmentRepository.findAllAndPaginate(queryParams);

    return departments;
  }

  async findOne(id: string): Promise<Departments> {
    return this.departmentRepository.findOneWithEmployeeCount(id);
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
