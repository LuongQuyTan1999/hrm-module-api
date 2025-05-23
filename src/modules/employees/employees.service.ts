import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Employee } from './entities/employee-profile.entity';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { User } from '../auth/entities/user.entity';
import { Role } from 'src/common/enum/role.enum';

@Injectable()
export class EmployeesService {
  constructor(
    @InjectRepository(Employee)
    private employeeRepository: Repository<Employee>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async create(
    createEmployeeDto: CreateEmployeeDto,
    currentUser: User,
  ): Promise<Employee> {
    if (currentUser.role !== Role.ADMIN) {
      throw new ForbiddenException('Chỉ admin có thể tạo hồ sơ nhân viên');
    }

    const user = await this.userRepository.findOne({
      where: { id: createEmployeeDto.user_id },
    });

    if (!user) {
      throw new NotFoundException('Người dùng không tồn tại');
    }

    const existingEmployee = await this.employeeRepository.findOne({
      where: { user_id: createEmployeeDto.user_id },
    });

    if (existingEmployee) {
      throw new ForbiddenException(
        'Hồ sơ nhân viên cho người dùng này đã tồn tại',
      );
    }

    const employee = this.employeeRepository.create({
      ...createEmployeeDto,
      user,
      created_by: currentUser.id,
    });
    return this.employeeRepository.save(employee);
  }
}
