import { InjectRepository } from '@mikro-orm/nestjs';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { EmployeeSalaries } from 'src/common/db/entities/employeesalarie.entity';
import { CreateSalaryDto } from './dto/salary.dto';
import { EntityManager, EntityRepository } from '@mikro-orm/postgresql';
import { Employees } from 'src/common/db/entities/employee.entity';
import { SalaryRules } from 'src/common/db/entities/salaryrule.entity';
import { EmployeesService } from '../employees/employees.service';

@Injectable()
export class SalariesService {
  constructor(
    @InjectRepository(EmployeeSalaries)
    private readonly employeeSalariesRepository: EntityRepository<EmployeeSalaries>,
    @InjectRepository(SalaryRules)
    private readonly salaryRulesRepository: EntityRepository<SalaryRules>,
    private readonly employeesSer: EmployeesService,

    private readonly em: EntityManager,
  ) {}

  async createEmployeeSalary(body: CreateSalaryDto): Promise<EmployeeSalaries> {
    try {
      await this.employeesSer.findOne(body.employeeId);

      const salary = this.employeeSalariesRepository.create({
        employee: this.em.getReference(Employees, body.employeeId),
        ...body,
      });

      await this.em.persistAndFlush(salary);

      return salary;
    } catch (error) {
      throw new BadRequestException(`Error: ${error.message}`);
    }
  }

  async getEmployeeSalary(employeeId: string): Promise<EmployeeSalaries> {
    try {
      const employee = await this.employeesSer.findOne(employeeId);

      const salary = await this.employeeSalariesRepository.findOne({
        employee: employeeId,
      });

      if (!salary) {
        throw new NotFoundException(
          `Can't find salary for employee ${employee.employeeCode}`,
        );
      }

      return salary;
    } catch (error) {
      throw new BadRequestException(`Error: ${error.message}`);
    }
  }

  async getSalaryRule({
    employee,
    periodEnd,
  }: {
    employee: Employees;
    periodEnd: string;
  }): Promise<SalaryRules> {
    try {
      const salaryRule = await this.salaryRulesRepository.findOne(
        {
          employee,
          position: employee.position,
          department: employee.department,
          effectiveDate: { $lte: periodEnd },
          $or: [{ expiryDate: { $gte: periodEnd } }, { expiryDate: null }],
        },
        { orderBy: { employee: 'DESC' } },
      );

      if (!salaryRule) {
        throw new NotFoundException(
          `Salary rule not found for ${employee.firstName} ${employee.lastName}`,
        );
      }

      return salaryRule;
    } catch (error) {
      throw new BadRequestException(`Error: ${error.message}`);
    }
  }
}
