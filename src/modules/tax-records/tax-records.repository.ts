import { EntityRepository } from '@mikro-orm/postgresql';
import { Employees } from 'src/common/db/entities/employee.entity';
import { Payroll } from 'src/common/db/entities/payroll.entity';
import { TaxRecords } from 'src/common/db/entities/taxrecord.entity';

export class TaxRecordsRepository extends EntityRepository<TaxRecords> {
  async createTax(
    payroll: any,
    employeeId: string,
    periodStart: string,
    periodEnd: string,
  ): Promise<TaxRecords> {
    const taxRecord = this.create({
      payroll: this.em.getReference(Payroll, payroll.id),
      employee: this.em.getReference(Employees, employeeId),
      periodStartDate: periodStart,
      periodEndDate: periodEnd,
      taxableIncome: payroll.taxableIncome.toFixed(2),
      pit: payroll.pit.toFixed(2),
      dependents: payroll.dependentsCount,
    });

    //  const auditLog = this.auditLogsRepository.create({
    //   user_id: userId,
    //   action: 'CALCULATE_PAYROLL',
    //   entity_name: 'payroll',
    //   entity_id: payroll.payroll_id,
    //   details: { employee_id: employeeId, net_salary: netSalary },
    // });
    // await this.auditLogsRepository.save(auditLog);

    await this.em.persistAndFlush(taxRecord);

    return taxRecord;
  }
}
