import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository } from '@mikro-orm/postgresql';
import { BadRequestException, Injectable } from '@nestjs/common';
import { Attendance } from 'src/common/db/entities/attendance.entity';
import { Payroll } from 'src/common/db/entities/payroll.entity';
import { ShiftConfigurations } from 'src/common/db/entities/shiftconfiguration.entity';
import { EmployeesService } from '../employees/employees.service';
import { InsuranceRepository } from '../insurance/insurance.repository';
import { PayrollDetailsRepository } from '../payroll-details/payroll-details.repository';
import { SalariesService } from '../salaries/salaries.service';
import { TaxRecordsRepository } from '../tax-records/payroll.repository';
import { CreatePayrollDto, PayrollQueryDto } from './dto/payroll.dto';
import { PayrollRepository } from './payroll.repository';
import { PayrollCalculatorService } from './services/payroll-calculator.service';
import { AdvanceRequestsService } from '../advance-requests/advance-requests.service';

@Injectable()
export class PayrollService {
  constructor(
    @InjectRepository(Attendance)
    private readonly attendanceRep: EntityRepository<Attendance>,
    @InjectRepository(ShiftConfigurations)
    private readonly shiftConfigurationRep: EntityRepository<ShiftConfigurations>,

    private readonly payrollRep: PayrollRepository,
    private readonly advanceRequestsSer: AdvanceRequestsService,
    private readonly salaryService: SalariesService,
    private readonly calculatorSer: PayrollCalculatorService,
    private readonly salaries: SalariesService,
    private readonly payrollDetails: PayrollDetailsRepository,
    private readonly insurance: InsuranceRepository,
    private readonly tax: TaxRecordsRepository,
    private readonly employeesSer: EmployeesService,
  ) {}

  async createPayroll(body: CreatePayrollDto) {
    try {
      const { employeeId, periodStart, periodEnd } = body;
      const employee = await this.employeesSer.findOne(employeeId);

      const [salaryRule, employeeSalary, attendanceRecords] = await Promise.all(
        [
          this.salaries.getSalary({
            position: employee.position,
            department: employee.department,
          }),
          this.salaryService.getEmployeeSalary(employeeId),
          this.attendanceRep.findAll({
            where: {
              employee, // You can use the shorthand here
              checkIn: { $gte: periodStart, $lte: periodEnd },
              checkOut: { $ne: null },
            },
            orderBy: { checkIn: 'ASC' },
          }),
        ],
      );

      const shift = await this.shiftConfigurationRep.findOne({
        id: attendanceRecords[0]?.shift?.id,
      });

      const totalAdvanceAmount =
        await this.advanceRequestsSer.getTotalAdvanceAmountByEmployeeId(
          employeeId,
        );

      const calculationResult = this.calculatorSer.calculate({
        basicSalary: Number(employeeSalary.salaryAmount || 0),
        allowanceRule: salaryRule.allowanceRule,
        bonusRule: salaryRule.bonusRule,
        deductionRule: salaryRule.deductionRule,
        overtimeRate: 150000, // Should be from config
        overtimeMultiplier: Number(shift?.overtimeMultiplier) || 1.5,
        dependents: 0, // Should be from employee data
        totalAdvanceAmount,
        attendanceRecords,
      });

      const data = {
        ...calculationResult,
        totalAdvanceAmount,
        dependents: 0,
      };

      const payroll = await this.payrollRep.createPayroll(
        data,
        employeeId,
        periodStart,
        periodEnd,
      );

      const dataDetails = {
        ...data,
        allowances: salaryRule.allowanceRule,
        bonuses: salaryRule.bonusRule,
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
}
