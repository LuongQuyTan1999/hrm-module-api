import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityManager, EntityRepository } from '@mikro-orm/postgresql';
import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Employees } from 'src/common/db/entities/employee.entity';
import { Users } from 'src/common/db/entities/user.entity';
import { Role } from 'src/common/enum/role.enum';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { FindEmployeesDto } from './dto/query.dto';
import { EmployeeRepository } from './employees.repository';
import * as bcrypt from 'bcrypt';
import { Departments } from 'src/common/db/entities/department.entity';
import { Positions } from 'src/common/db/entities/position.entity';
import { UpdateEmployeeDto } from './dto/update-employee.dto';

@Injectable()
export class EmployeesService {
  constructor(
    @InjectRepository(Users)
    private userRepository: EntityRepository<Users>,
    @InjectRepository(Employees)
    private readonly employeeRepository: EmployeeRepository,
    private readonly em: EntityManager,
  ) {}

  /**
   * Create a new employee profile
   * @param body - Employee profile information
   * @param currentUser - Current user making the request, only ADMIN can create profiles
   * @returns Employee profile created
   */
  async create(
    body: CreateEmployeeDto,
    currentUser: Users,
  ): Promise<Employees> {
    if (currentUser.role !== Role.ADMIN) {
      throw new ForbiddenException('Chỉ admin có thể tạo hồ sơ nhân viên');
    }

    const existingEmployee = await this.employeeRepository.findOne({
      email: body.email,
    });

    if (existingEmployee) {
      throw new ForbiddenException(
        'Hồ sơ nhân viên cho người dùng này đã tồn tại',
      );
    }

    const employeeCode = await this.generateEmployeeCode();

    const employee = this.employeeRepository.create({
      ...body,
      employeeCode,
      department: this.em.getReference(Departments, body.departmentId),
      position: this.em.getReference(Positions, body.positionId),
      createdBy: currentUser.id,
    });

    await this.em.persistAndFlush(employee);
    return employee;
  }

  /**
   * Get a paginated list of employee profiles
   * @param query - Pagination and filtering parameters
   * @returns Employees profiles
   */
  async findAll(query: FindEmployeesDto) {
    return this.employeeRepository.findPaginated(query);
  }

  /**
   * Get an employee profile by ID
   * @param id - ID of the employee profile
   * @param currentUser - Current user making the request
   * @returns Employee profile found
   */
  async findOne(id: string, currentUser: Users): Promise<Employees> {
    const employee = await this.employeeRepository.findOne(id, {
      populate: ['department', 'position'],
    });

    if (!employee) {
      throw new NotFoundException('Hồ sơ nhân viên không tồn tại');
    }

    if (
      currentUser.role !== Role.ADMIN &&
      currentUser.role !== Role.MANAGER
      // employee.user.id !== currentUser.id
    ) {
      throw new ForbiddenException('Bạn không có quyền truy cập hồ sơ này');
    }

    return employee;
  }

  /**
   * Update an employee profile by ID
   * @param id - ID of the employee profile
   * @param body - Information to update
   * @returns Employee profile updated
   */
  async update(id: string, body: UpdateEmployeeDto): Promise<Employees> {
    const employee = await this.employeeRepository.findOne(id);

    if (!employee) {
      throw new NotFoundException('Hồ sơ nhân viên không tồn tại');
    }

    Object.assign(employee, body);

    await this.em.persistAndFlush(employee);
    return employee;
  }

  /**
   * Remove an employee profile by ID
   * @param id - ID of the employee profile
   * @returns Notification message
   */
  async delete(id: string): Promise<{ message: string }> {
    const employee = await this.employeeRepository.findOne(id);

    if (!employee) {
      throw new NotFoundException('Hồ sơ nhân viên không tồn tại');
    }

    await this.em.removeAndFlush(employee);

    return { message: 'Hồ sơ nhân viên đã được xóa thành công' };
  }

  async createUser(
    employeeId: string,
    createUserDto: CreateUserDto,
  ): Promise<Users> {
    const employee = await this.employeeRepository.findOne(employeeId);
    if (!employee) {
      throw new BadRequestException('Employee not found');
    }

    const existingUser = await this.userRepository.findOne({
      $or: [{ username: createUserDto.username }, { employee }],
    });

    if (existingUser) {
      throw new BadRequestException(
        'Username or employee already has a user account',
      );
    }

    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

    const user = this.userRepository.create({
      employee,
      username: createUserDto.username,
      password: hashedPassword,
      role: createUserDto.role,
    });

    await this.em.persistAndFlush(user);
    return user;
  }

  private async generateEmployeeCode(): Promise<string> {
    const lastEmployee = await this.employeeRepository.findOne(
      { employeeCode: { $ne: null } },
      { orderBy: { createdAt: 'DESC' } },
    );

    if (!lastEmployee) {
      return 'ZW0001';
    }

    const lastCode = lastEmployee.employeeCode;
    const codeNumber = parseInt(lastCode.replace('ZW', ''), 10);
    const newCodeNumber = codeNumber + 1;
    return `ZW${newCodeNumber.toString().padStart(4, '0')}`;
  }
}
