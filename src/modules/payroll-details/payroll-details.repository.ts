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
    const allowanceDetailsRecords = Object.entries(
      payroll.allowanceDetails,
    ).map(([name, amount]) =>
      this.create({
        payroll: this.em.getReference(Payroll, payroll.id),
        employee: this.em.getReference(Employees, employeeId),
        periodStartDate: periodStart,
        periodEndDate: periodEnd,
        componentType: 'allowance',
        componentName: name,
        amount: String(amount),
        description: `${name} allowance`,
      }),
    );

    const bonusDetailsRecords = Object.entries(payroll.bonusDetails).map(
      ([name, amount]) =>
        this.create({
          payroll: this.em.getReference(Payroll, payroll.id),
          employee: this.em.getReference(Employees, employeeId),
          periodStartDate: periodStart,
          periodEndDate: periodEnd,
          componentType: 'bonus',
          componentName: name,
          amount: Number(amount).toFixed(2),
          description: `${name} bonus`,
        }),
    );

    const deductionDetailsRecords = Object.entries(
      payroll.deductionDetails,
    ).map(([name, amount]) =>
      this.create({
        payroll: this.em.getReference(Payroll, payroll.id),
        employee: this.em.getReference(Employees, employeeId),
        periodStartDate: periodStart,
        periodEndDate: periodEnd,
        componentType: 'deduction',
        componentName: name,
        amount: Number(amount).toFixed(2),
        description: `${name} deduction`,
      }),
    );

    const allDetailsToPersist = [
      ...allowanceDetailsRecords,
      ...bonusDetailsRecords,
      ...deductionDetailsRecords,
    ];

    if (allDetailsToPersist.length > 0) {
      await this.em.persistAndFlush(allDetailsToPersist);
    }

    const payrollDetails = {} as PayrollDetails;

    return payrollDetails;
  }
}
