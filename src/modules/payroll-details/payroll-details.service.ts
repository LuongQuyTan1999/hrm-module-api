import { EntityManager } from '@mikro-orm/postgresql';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InsuranceRepository } from '../insurance/insurance.repository';
import { OvertimeService } from '../overtime/overtime.service';
import { PayrollService } from '../payroll/payroll.service';
import { TaxRecordsRepository } from '../tax-records/tax-records.repository';
import { PayrollDetailsRepository } from './payroll-details.repository';

@Injectable()
export class PayrollDetailsService {
  constructor(
    private readonly PayrollDetailsRep: PayrollDetailsRepository,
    private readonly payrollSer: PayrollService,
    private readonly insuranceRep: InsuranceRepository,
    private readonly taxRecordsRep: TaxRecordsRepository,
    private readonly overtimeSer: OvertimeService,
    private readonly em: EntityManager,
  ) {}

  async getPayrollDetails(id: string): Promise<any> {
    try {
      const payroll = await this.payrollSer.getPayroll(id);

      if (!payroll) {
        throw new NotFoundException(`Can't find payroll with id: ${id}`);
      }

      const [details, insurance, tax] = await Promise.all([
        await this.PayrollDetailsRep.find({
          payroll,
        }),
        await this.insuranceRep.findOne({
          payroll,
        }),
        await this.taxRecordsRep.findOne({
          payroll,
        }),
        // await this.overtimeSer.getOvertimeByEmployeeId(
        //   payroll.employee.id,
        //   payroll.payPeriodStart,
        //   payroll.payPeriodEnd,
        // ),
      ]);

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
        // overtimeDetails: overtime.map((detail) => ({
        //   id: detail.id,
        //   overtimeDate: detail.overtimeDate,
        //   overtimeHours: detail.overtimeHours,
        //   // shiftName: detail.shift?.name || 'Standard',
        //   // overtimeMultiplier: detail.shift?.overtimeMultiplier,
        //   // amount: detail.overtimeHours + ,
        //   reason: detail.reason,
        // })),
        createdAt: payroll.createdAt,
      };
    } catch (error) {
      throw new BadRequestException(`Error: ${error.message}`);
    }
  }
}
