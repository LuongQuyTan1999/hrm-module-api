import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PayrollService } from '../payroll/payroll.service';
import { PayrollDetailsRepository } from './payroll-details.repository';
import { InsuranceRepository } from '../insurance/insurance.repository';
import { TaxRecordsRepository } from '../tax-records/tax-records.repository';

@Injectable()
export class PayrollDetailsService {
  constructor(
    private readonly PayrollDetailsRep: PayrollDetailsRepository,
    private readonly payrollSer: PayrollService,
    private readonly insuranceRep: InsuranceRepository,
    private readonly taxRecordsRep: TaxRecordsRepository,
  ) {}

  async getPayrollDetails(id: string): Promise<any> {
    try {
      const payroll = await this.payrollSer.getPayroll(id);

      if (!payroll) {
        throw new NotFoundException(`Can't find payroll with id: ${id}`);
      }

      const details = await this.PayrollDetailsRep.find({
        payroll,
      });

      const insurance = await this.insuranceRep.findOne({
        payroll,
      });

      const tax = await this.taxRecordsRep.findOne({
        payroll,
      });

      return {
        employee: payroll.employee,
        payPeriodStart: payroll.payPeriodStart,
        payPeriodEnd: payroll.payPeriodEnd,
        basicSalary: payroll.basicSalary,
        totalAllowances: payroll.allowances,
        totalBonuses: payroll.bonuses,
        totalDeductions: payroll.deductions,
        overtimeSalary: payroll.overtimeSalary,
        netSalary: payroll.netSalary,
        advanceAmount: payroll.advanceAmount,
        socialInsuranceEmployee: insurance?.socialInsuranceEmployee || 0,
        healthInsuranceEmployee: insurance?.healthInsuranceEmployee || 0,
        unemploymentInsuranceEmployee:
          insurance?.unemploymentInsuranceEmployee || 0,
        pit: tax?.pit || 0,
        taxableIncome: tax?.taxableIncome || 0,
        dependents: tax?.dependents || 0,
        status: payroll.status,
        details: details.map((d) => ({
          componentType: d.componentType,
          componentName: d.componentName,
          amount: d.amount,
          description: d.description,
        })),
        createdAt: payroll.createdAt,
      };
    } catch (error) {
      throw new BadRequestException(`Error: ${error.message}`);
    }
  }
}
