import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository } from '@mikro-orm/postgresql';
import { Employees } from 'src/common/db/entities/employee.entity';

@Injectable()
export class EmployeeValidationService {
  constructor(
    @InjectRepository(Employees)
    private readonly employeeRepository: EntityRepository<Employees>,
  ) {}

  async validateEmployeeExists(employeeId: string): Promise<Employees> {
    const employee = await this.employeeRepository.findOne({ id: employeeId });

    if (!employee) {
      throw new NotFoundException(`Employee with ID ${employeeId} not found`);
    }

    return employee;
  }

  async validateEmployeeInDepartment(
    employeeId: string,
    departmentId: string,
  ): Promise<Employees> {
    const employee = await this.validateEmployeeExists(employeeId);

    if (employee.department?.id !== departmentId) {
      throw new NotFoundException(
        `Employee ${employeeId} is not in department ${departmentId}`,
      );
    }

    return employee;
  }

  async validateEmployeeInPosition(
    employeeId: string,
    positionId: string,
  ): Promise<Employees> {
    const employee = await this.validateEmployeeExists(employeeId);

    if (employee.position?.id !== positionId) {
      throw new NotFoundException(
        `Employee ${employeeId} is not in position ${positionId}`,
      );
    }

    return employee;
  }
}
