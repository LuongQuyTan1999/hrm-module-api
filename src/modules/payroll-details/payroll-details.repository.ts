import { EntityRepository } from '@mikro-orm/postgresql';
import { Employees } from 'src/common/db/entities/employee.entity';
import { Payroll } from 'src/common/db/entities/payroll.entity';
import { PayrollDetails } from 'src/common/db/entities/payrolldetail.entity';

export class PayrollDetailsRepository extends EntityRepository<PayrollDetails> {
  async createPayrollDetails(
    payroll: any,
    employeeId: string,
    periodStart: string,
    periodEnd: string,
  ): Promise<PayrollDetails> {
    const payrollDetails = this.create({
      payroll: this.em.getReference(Payroll, payroll.id),
      employee: this.em.getReference(Employees, employeeId),
      periodStartDate: periodStart,
      periodEndDate: periodEnd,
      basicSalary: payroll.basicSalary.toFixed(2),
      allowances: payroll.allowances,
      bonuses: payroll.bonuses,
      deductions: {
        social_insurance:
          payroll.insurance.social_insurance_employee.toFixed(2),
        health_insurance:
          payroll.insurance.health_insurance_employee.toFixed(2),
        unemployment_insurance:
          payroll.insurance.unemployment_insurance_employee.toFixed(2),
        union_fee: payroll.unionFee.toFixed(2),
        personal_income_tax: payroll.pit.toFixed(2),
      },
      overtimeHours: payroll.overtimeHours.toFixed(2),
      overtimeSalary: payroll.overtimeSalary.toFixed(2),
      netSalary: payroll.netSalary.toFixed(2),
      workingHours: payroll.workingHours.toFixed(2),
      advanceAmount: payroll.totalAdvanceAmount.toFixed(2),
    });

    await this.em.persistAndFlush(payrollDetails);

    return payrollDetails;
  }
}
