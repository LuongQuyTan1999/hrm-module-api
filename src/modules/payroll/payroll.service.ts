import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository, FilterQuery } from '@mikro-orm/postgresql';
import { BadRequestException, Injectable } from '@nestjs/common';
import { EmployeeBenefits } from 'src/common/db/entities/employeebenefit.entity';
import { Payroll } from 'src/common/db/entities/payroll.entity';
import { AdvanceRequestsService } from '../advance-requests/advance-requests.service';
import { EmployeesService } from '../employees/employees.service';
import { InsuranceRepository } from '../insurance/insurance.repository';
import { OvertimeService } from '../overtime/overtime.service';
import { PayrollDetailsRepository } from '../payroll-details/payroll-details.repository';
import { SalariesService } from '../salaries/salaries.service';
import { TaxRecordsRepository } from '../tax-records/tax-records.repository';
import {
  CreatePayrollBatchDto,
  CreatePayrollDto,
  PayrollQueryDto,
} from './dto/payroll.dto';
import { PayrollRepository } from './payroll.repository';
import { PayrollCalculatorService } from './services/payroll-calculator.service';
import { EmployeeRepository } from '../employees/employees.repository';
import { Employees } from 'src/common/db/entities/employee.entity';

@Injectable()
export class PayrollService {
  constructor(
    @InjectRepository(EmployeeBenefits)
    private readonly employeeBenefitsRep: EntityRepository<EmployeeBenefits>,

    private readonly payrollRep: PayrollRepository,
    private readonly advanceRequestsSer: AdvanceRequestsService,
    private readonly calculatorSer: PayrollCalculatorService,
    private readonly salaries: SalariesService,
    private readonly payrollDetails: PayrollDetailsRepository,
    private readonly insurance: InsuranceRepository,
    private readonly tax: TaxRecordsRepository,
    private readonly employeesSer: EmployeesService,
    private readonly overtimeSer: OvertimeService,
    private readonly employeeRep: EmployeeRepository,
  ) {}

  async createPayroll(body: CreatePayrollDto) {
    try {
      const { employeeId, periodStart, periodEnd } = body;
      const employee = await this.employeesSer.findOne(employeeId);

      const [salaryRule, benefits, overtimeSalary, totalAdvanceAmount] =
        await Promise.all([
          this.salaries.getSalaryRule({
            employee,
            periodEnd,
          }),
          this.employeeBenefitsRep.findOne({
            employee,
            benefitType: 'dependents',
            effectiveDate: { $lte: periodEnd },
            $or: [{ expiryDate: { $gte: periodEnd } }, { expiryDate: null }],
          }),
          this.overtimeSer.calculateOvertimeSalary(
            employeeId,
            periodStart,
            periodEnd,
          ),
          await this.advanceRequestsSer.getTotalAdvanceAmountByEmployeeId(
            employeeId,
            periodStart,
            periodEnd,
          ),
        ]);

      const calculationResult = await this.calculatorSer.calculate({
        salaryRule,
        benefits,
        totalAdvanceAmount,
        periodEnd,
        overtimeSalary,
      });

      const data = {
        ...calculationResult,
        totalAdvanceAmount,
      };

      const payroll = await this.payrollRep.createPayroll(
        data,
        employeeId,
        periodStart,
        periodEnd,
      );

      const dataDetails = {
        ...data,
        allowanceDetails: salaryRule.allowanceRule,
        bonusDetails: salaryRule.bonusRule,
        deductionDetails: salaryRule.deductionRule,
        id: payroll.id,
      };

      await Promise.all([
        this.payrollDetails.createPayrollDetails(
          dataDetails,
          employeeId,
          periodStart,
          periodEnd,
        ),
        this.insurance.createInsuranceContributions(
          dataDetails,
          employeeId,
          periodStart,
          periodEnd,
        ),
        this.tax.createTax(dataDetails, employeeId, periodStart, periodEnd),
      ]);

      return payroll;
    } catch (error) {
      throw new BadRequestException(
        `Error calculating payroll: ${error.message}`,
      );
    }
  }

  async createPayrollBatch(body: CreatePayrollBatchDto): Promise<{
    payrolls: Payroll[];
  }> {
    try {
      const { departmentIds, periodStart, periodEnd } = body;
      const payrolls: Payroll[] = [];

      const where: FilterQuery<Employees> = {
        hireDate: { $lte: periodEnd },
      };

      if (departmentIds && departmentIds.length > 0) {
        where.department = { $in: departmentIds };
      }

      const employees = await this.employeeRep.find(where);

      if (employees.length === 0) {
        throw new Error('No employees found for the specified criteria');
      }

      for (const employee of employees) {
        try {
          const payroll = await this.createPayroll({
            employeeId: employee.id,
            periodStart,
            periodEnd,
          });
          payrolls.push(payroll);
        } catch (error) {
          throw new BadRequestException(`Error: ${error.message}`);
        }
      }

      return { payrolls };
    } catch (error) {
      throw new BadRequestException(`Error: ${error.message}`);
    }
  }

  async getPayrolls(query: PayrollQueryDto): Promise<{
    items: Payroll[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    try {
      const filters: Record<string, any> = {};
      const {
        page = 1,
        limit = 10,
        employeeId,
        periodStart,
        periodEnd,
      } = query;

      const qb = this.payrollRep
        .createQueryBuilder('p')
        .leftJoinAndSelect('p.employee', 'e')
        .leftJoinAndSelect('e.position', 'pos')
        .leftJoinAndSelect('e.department', 'd')
        .orderBy({ 'p.updatedAt': 'DESC' });

      if (employeeId) {
        filters['p.employee'] = employeeId;
      }

      if (periodStart) {
        filters['p.payPeriodStart'] = { $gte: periodStart };
      }

      if (periodEnd) {
        filters['p.payPeriodEnd'] = { $lte: periodEnd };
      }

      if (Object.keys(filters).length > 0) {
        qb.andWhere(filters);
      }

      const offset = (page - 1) * limit;
      qb.offset(offset).limit(limit);

      const [items, total] = await qb.getResultAndCount();

      return {
        items,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      };
    } catch (error) {
      throw new BadRequestException(
        `Error fetching payrolls: ${error.message}`,
      );
    }
  }

  async getPayroll(payrollId: string): Promise<Payroll> {
    try {
      const payroll = await this.payrollRep.findOne(
        {
          id: payrollId,
        },
        { populate: ['employee'] },
      );

      if (!payroll) {
        throw new Error('Payroll not found');
      }

      return payroll;
    } catch (error) {
      throw new BadRequestException(`Error: ${error.message}`);
    }
  }
}
