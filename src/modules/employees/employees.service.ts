import { EntityManager } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository } from '@mikro-orm/postgresql';
import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Role } from 'src/common/enum/role.enum';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { Employees } from 'src/common/db/entities/employee.entity';
import { Users } from 'src/common/db/entities/user.entity';

@Injectable()
export class EmployeesService {
  constructor(
    @InjectRepository(Employees)
    private employeeRepository: EntityRepository<Employees>,
    @InjectRepository(Users)
    private userRepository: EntityRepository<Users>,
    private readonly em: EntityManager,
  ) {}

  async create(
    createEmployeeDto: CreateEmployeeDto,
    currentUser: Users,
  ): Promise<Employees> {
    if (currentUser.role !== Role.ADMIN) {
      throw new ForbiddenException('Chỉ admin có thể tạo hồ sơ nhân viên');
    }

    const user = await this.userRepository.findOne({
      id: createEmployeeDto.userId,
    });

    if (!user) {
      throw new NotFoundException('Người dùng không tồn tại');
    }

    const existingEmployee = await this.employeeRepository.findOne({
      user: createEmployeeDto.userId,
    });

    if (existingEmployee) {
      throw new ForbiddenException(
        'Hồ sơ nhân viên cho người dùng này đã tồn tại',
      );
    }

    const employee = this.employeeRepository.create({
      ...createEmployeeDto,
      user,
      createdBy: currentUser.id,
    });

    await this.em.persistAndFlush(employee);
    return employee;
  }
}
