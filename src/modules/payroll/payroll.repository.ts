import { EntityRepository } from '@mikro-orm/postgresql';
import { Employees } from 'src/common/db/entities/employee.entity';
import { Payroll } from 'src/common/db/entities/payroll.entity';

export class PayrollRepository extends EntityRepository<Payroll> {
  async createPayroll(
    data: any,
    employeeId: string,
    periodStart: string,
    periodEnd: string,
  ): Promise<Payroll> {
    const payroll = this.create({
      employee: this.em.getReference(Employees, employeeId),
      payPeriodStart: periodStart,
      payPeriodEnd: periodEnd,
      basicSalary: data.basicSalary.toFixed(2),
      allowances: data.allowances.toFixed(2),
      bonuses: data.bonuses.toFixed(2),
      deductions: (
        data.insurance.total_insurance_employee +
        data.pit +
        data.deductions
      ).toFixed(2),
      netSalary: data.netSalary.toFixed(2),
      overtimeSalary: data.overtimeSalary.toFixed(2),
      advanceAmount: data.totalAdvanceAmount.toFixed(2),
    });

    await this.em.persistAndFlush(payroll);

    return payroll;
  }
}
