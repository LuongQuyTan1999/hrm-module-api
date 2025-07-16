import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CalculatorPayrollDto, PayrollQueryDto } from './dto/payroll.dto';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Payroll } from 'src/common/db/entities/payroll.entity';
import { EntityManager, EntityRepository } from '@mikro-orm/postgresql';
import { Employees } from 'src/common/db/entities/employee.entity';
import { Attendance } from 'src/common/db/entities/attendance.entity';
import { ShiftConfigurations } from 'src/common/db/entities/shiftconfiguration.entity';
import { SalaryRules } from 'src/common/db/entities/salaryrule.entity';
import { EmployeeValidationService } from '../employees/services/employee-validation.service';
import { PayrollDetails } from 'src/common/db/entities/payrolldetail.entity';
import { InsuranceContributions } from 'src/common/db/entities/insurancecontribution.entity';
import { TaxRecords } from 'src/common/db/entities/taxrecord.entity';
import { AdvanceRequestsService } from './services/advance-requests.service';

@Injectable()
export class PayrollService {
  constructor(
    @InjectRepository(Payroll)
    private readonly payrollRepository: EntityRepository<Payroll>,
    @InjectRepository(PayrollDetails)
    private readonly payrollDetailsRepository: EntityRepository<PayrollDetails>,
    @InjectRepository(Employees)
    private readonly employeeRepository: EntityRepository<Employees>,
    @InjectRepository(Attendance)
    private readonly attendanceRepository: EntityRepository<Attendance>,
    @InjectRepository(ShiftConfigurations)
    private readonly shiftConfigurationRepository: EntityRepository<ShiftConfigurations>,
    @InjectRepository(SalaryRules)
    private readonly salaryRulesRepository: EntityRepository<SalaryRules>,
    @InjectRepository(InsuranceContributions)
    private readonly insuranceContributionsRepository: EntityRepository<InsuranceContributions>,
    @InjectRepository(TaxRecords)
    private readonly taxRecordsRepository: EntityRepository<TaxRecords>,
    private readonly employeeValidationService: EmployeeValidationService,
    private readonly advanceRequestsService: AdvanceRequestsService,
    private readonly em: EntityManager,
  ) {}

  private calculateInsurance(basicSalary: number) {
    const SOCIAL_INSURANCE_CAP = 36000000; // 36M VND
    const UNEMPLOYMENT_INSURANCE_CAP = 20800000; // 20.8M VND

    const socialInsuranceEmployee =
      Math.min(basicSalary, SOCIAL_INSURANCE_CAP) * 0.08;
    const healthInsuranceEmployee =
      Math.min(basicSalary, SOCIAL_INSURANCE_CAP) * 0.015;
    const unemploymentInsuranceEmployee =
      Math.min(basicSalary, UNEMPLOYMENT_INSURANCE_CAP) * 0.01;
    const socialInsuranceEmployer =
      Math.min(basicSalary, SOCIAL_INSURANCE_CAP) * 0.175;
    const healthInsuranceEmployer =
      Math.min(basicSalary, SOCIAL_INSURANCE_CAP) * 0.03;
    const unemploymentInsuranceEmployer =
      Math.min(basicSalary, UNEMPLOYMENT_INSURANCE_CAP) * 0.01;

    return {
      social_insurance_employee: socialInsuranceEmployee,
      health_insurance_employee: healthInsuranceEmployee,
      unemployment_insurance_employee: unemploymentInsuranceEmployee,
      social_insurance_employer: socialInsuranceEmployer,
      health_insurance_employer: healthInsuranceEmployer,
      unemployment_insurance_employer: unemploymentInsuranceEmployer,
      total_insurance_employee:
        socialInsuranceEmployee +
        healthInsuranceEmployee +
        unemploymentInsuranceEmployee,
      total_insurance_employer:
        socialInsuranceEmployer +
        healthInsuranceEmployer +
        unemploymentInsuranceEmployer,
    };
  }

  private calculatePIT(taxableIncome: number, dependents) {
    const PERSONAL_EXEMPTION = 11000000; // 11M VND
    const DEPENDENT_EXEMPTION = 4400000; // 4.4M VND

    const taxableIncomeAfterExemption = Math.max(
      taxableIncome - PERSONAL_EXEMPTION - dependents * DEPENDENT_EXEMPTION,
      0,
    );

    let pit = 0;
    if (taxableIncomeAfterExemption <= 5000000) {
      pit = taxableIncomeAfterExemption * 0.05;
    } else if (taxableIncomeAfterExemption <= 10000000) {
      pit = 250000 + (taxableIncomeAfterExemption - 5000000) * 0.1;
    } else if (taxableIncomeAfterExemption <= 18000000) {
      pit = 750000 + (taxableIncomeAfterExemption - 10000000) * 0.15;
    } else if (taxableIncomeAfterExemption <= 32000000) {
      pit = 1950000 + (taxableIncomeAfterExemption - 18000000) * 0.2;
    } else if (taxableIncomeAfterExemption <= 52000000) {
      pit = 4750000 + (taxableIncomeAfterExemption - 32000000) * 0.25;
    } else if (taxableIncomeAfterExemption <= 80000000) {
      pit = 9750000 + (taxableIncomeAfterExemption - 52000000) * 0.3;
    } else {
      pit = 18150000 + (taxableIncomeAfterExemption - 80000000) * 0.35;
    }

    return pit;
  }

  async calculatePayroll(body: CalculatorPayrollDto) {
    try {
      const { employeeId, periodStart, periodEnd } = body;
      const employee =
        await this.employeeValidationService.validateEmployeeExists(employeeId);

      const salaryRule = await this.salaryRulesRepository.findOne({
        position: employee.position,
        department: employee.department,
      });

      if (!salaryRule) {
        throw new NotFoundException(
          'Salary rule not found for the employee position and department.',
        );
      }

      const basicSalary = Number(salaryRule.basicSalary);
      const allowanceDetails = salaryRule.allowanceRule || {};
      const bonusDetails = salaryRule.bonusRule || {};
      const deductionDetails = salaryRule.deductionRule || {};

      const allowances = Number(
        (
          Number(allowanceDetails.lunch || 0) +
          Number(allowanceDetails.transport || 0) +
          Number(allowanceDetails.phone || 0) +
          Number(allowanceDetails.responsibility || 0)
        ).toFixed(2),
      );

      const bonuses = Number(
        (
          Number(bonusDetails.performance || 0) +
          Number(bonusDetails.projectCompletion || 0)
        ).toFixed(2),
      );

      const unionFee = Number(deductionDetails.unionFee || 0);

      // Attendance data
      const attendanceRecords = await this.attendanceRepository.findAll({
        where: {
          employee: employee,
          checkIn: { $gte: periodStart, $lte: periodEnd },
          checkOut: { $ne: null },
        },
        orderBy: { checkIn: 'ASC' },
      });

      const overtimeHours = attendanceRecords.reduce(
        (sum, record) => sum + (Number(record.overtimeHours) || 0),
        0,
      );
      const workingHours = attendanceRecords.reduce((sum, record) => {
        if (record.checkOut && record.checkIn) {
          return (
            sum +
            (record.checkOut.getTime() - record.checkIn.getTime()) / 3600000
          );
        }
        return sum;
      }, 0);

      // Get overtime multiplier from shift configuration
      const shift = await this.shiftConfigurationRepository.findOne({
        id: attendanceRecords[0]?.shift?.id,
      });

      const overtimeMultiplier = Number(shift?.overtimeMultiplier) || 1.5;
      const overtimeRate = 150000; // Example rate (VND/hour)
      const overtimeSalary = overtimeHours * overtimeRate * overtimeMultiplier;

      const insurance = this.calculateInsurance(basicSalary);
      const totalInsuranceEmployee = insurance.total_insurance_employee;

      const taxableIncome =
        basicSalary +
        allowances +
        bonuses +
        overtimeSalary -
        totalInsuranceEmployee -
        unionFee;

      // Calculate PIT
      const dependents = 0; // Default
      const pit = this.calculatePIT(taxableIncome, dependents);
      const dailyRate = Number(basicSalary / 22).toFixed(2); // Assuming 22 working days in a month

      // Calculate Advance Request
      const totalAdvanceAmount =
        await this.advanceRequestsService.getTotalAdvanceAmountByEmployeeId(
          employeeId,
        );

      // Calculate net salary
      const netSalary =
        basicSalary +
        allowances +
        bonuses +
        overtimeSalary -
        totalInsuranceEmployee -
        pit -
        unionFee -
        totalAdvanceAmount;

      // Create or update payroll record
      const payroll = this.payrollRepository.create({
        employee: this.em.getReference(Employees, employeeId),
        payPeriodStart: periodStart,
        payPeriodEnd: periodEnd,
        basicSalary: basicSalary.toFixed(2),
        allowances: allowances.toFixed(2),
        bonuses: bonuses.toFixed(2),
        deductions: (totalInsuranceEmployee + pit + unionFee).toFixed(2),
        netSalary: netSalary.toFixed(2),
        overtimeSalary: overtimeSalary.toFixed(2),
      });

      await this.em.transactional(async (transactionalEM) => {
        await transactionalEM.persistAndFlush(payroll);

        const payrollDetails = this.payrollDetailsRepository.create({
          payroll: this.em.getReference(Payroll, payroll.id),
          employee: this.em.getReference(Employees, employeeId),
          periodStartDate: periodStart,
          periodEndDate: periodEnd,
          basicSalary: basicSalary.toFixed(2),
          allowances: allowanceDetails,
          bonuses: bonusDetails,
          deductions: {
            social_insurance: insurance.social_insurance_employee.toFixed(2),
            health_insurance: insurance.health_insurance_employee.toFixed(2),
            unemployment_insurance:
              insurance.unemployment_insurance_employee.toFixed(2),
            union_fee: unionFee.toFixed(2),
            personal_income_tax: pit.toFixed(2),
          },
          overtimeHours: overtimeHours.toFixed(2),
          overtimeSalary: overtimeSalary.toFixed(2),
          netSalary: netSalary.toFixed(2),
          workingHours: workingHours.toFixed(2),
          dailyRate: dailyRate,
        });

        const insuranceContribution =
          this.insuranceContributionsRepository.create({
            payroll: this.em.getReference(Payroll, payroll.id),
            employee: this.em.getReference(Employees, employeeId),
            periodStartDate: periodStart,
            periodEndDate: periodEnd,
            socialInsuranceEmployee:
              insurance.social_insurance_employee.toFixed(2),
            healthInsuranceEmployee:
              insurance.health_insurance_employee.toFixed(2),
            unemploymentInsuranceEmployee:
              insurance.unemployment_insurance_employee.toFixed(2),
            socialInsuranceEmployer:
              insurance.social_insurance_employer.toFixed(2),
            healthInsuranceEmployer:
              insurance.health_insurance_employer.toFixed(2),
            unemploymentInsuranceEmployer:
              insurance.unemployment_insurance_employer.toFixed(2),
          });

        const taxRecord = this.taxRecordsRepository.create({
          payroll: this.em.getReference(Payroll, payroll.id),
          employee: this.em.getReference(Employees, employeeId),
          periodStartDate: periodStart,
          periodEndDate: periodEnd,
          taxableIncome: taxableIncome.toFixed(2),
          pit: pit.toFixed(2),
          dependents,
        });

        //     await AuditLogs.create({
        //   user_id: user?.user_id,
        //   action: 'CALCULATE_PAYROLL',
        //   entity_name: 'payroll',
        //   entity_id: payroll.payroll_id,
        //   details: {
        //     employee_id: employeeId,
        //     basic_salary: basicSalary,
        //     allowances: allowanceDetails,
        //     bonuses: bonusDetails,
        //     overtime_hours: overtimeHours,
        //     overtime_salary: overtimeSalary,
        //     insurance,
        //     pit,
        //     union_fee: unionFee,
        //     net_salary: netSalary,
        //     working_hours: workingHours,
        //     daily_rate: dailyRate,
        //     contribution_id: insuranceContribution.contribution_id,
        //     tax_record_id: taxRecord.tax_record_id,
        //     detail_id: payrollDetails.detail_id,
        //   },
        //   created_at: new Date(),
        // }

        await transactionalEM.persistAndFlush([
          payrollDetails,
          insuranceContribution,
          taxRecord,
        ]);
      });

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

      const qb = this.payrollRepository
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
