import { EntityRepository } from '@mikro-orm/postgresql';
import { Employees } from 'src/common/db/entities/employee.entity';
import { InsuranceContributions } from 'src/common/db/entities/insurancecontribution.entity';
import { Payroll } from 'src/common/db/entities/payroll.entity';

export class InsuranceRepository extends EntityRepository<InsuranceContributions> {
  async createInsuranceContributions(
    payroll: any,
    employeeId: string,
    periodStart: string,
    periodEnd: string,
  ): Promise<InsuranceContributions> {
    const insurance = this.create({
      payroll: this.em.getReference(Payroll, payroll.id),
      employee: this.em.getReference(Employees, employeeId),
      periodStartDate: periodStart,
      periodEndDate: periodEnd,
      socialInsuranceEmployee:
        payroll.insurance.social_insurance_employee.toFixed(2),
      healthInsuranceEmployee:
        payroll.insurance.health_insurance_employee.toFixed(2),
      unemploymentInsuranceEmployee:
        payroll.insurance.unemployment_insurance_employee.toFixed(2),
      socialInsuranceEmployer:
        payroll.insurance.social_insurance_employer.toFixed(2),
      healthInsuranceEmployer:
        payroll.insurance.health_insurance_employer.toFixed(2),
      unemploymentInsuranceEmployer:
        payroll.insurance.unemployment_insurance_employer.toFixed(2),
    });

    await this.em.persistAndFlush(insurance);

    return insurance;
  }
}
