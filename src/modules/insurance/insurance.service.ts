import { Injectable } from '@nestjs/common';
import { PayrollConfigService } from '../payroll-config/payroll-config.service';

@Injectable()
export class InsuranceService {
  constructor(private readonly payrollConfigSer: PayrollConfigService) {}

  async calculateInsurance(basicSalary: number, periodEnd: string) {
    const config = await this.payrollConfigSer.getPayrollConfig(periodEnd);

    const SOCIAL_INSURANCE_CAP = Number(config.socialInsuranceCap); // 36M VND
    const UNEMPLOYMENT_INSURANCE_CAP = Number(config.unemploymentInsuranceCap); // 20.8M VND

    const socialInsuranceEmployee =
      Math.min(basicSalary, SOCIAL_INSURANCE_CAP) *
      Number(config.socialInsuranceEmployeeRate);
    const healthInsuranceEmployee =
      Math.min(basicSalary, SOCIAL_INSURANCE_CAP) *
      Number(config.healthInsuranceEmployeeRate);
    const unemploymentInsuranceEmployee =
      Math.min(basicSalary, UNEMPLOYMENT_INSURANCE_CAP) *
      Number(config.unemploymentInsuranceEmployeeRate);

    const totalInsuranceEmployee =
      socialInsuranceEmployee +
      healthInsuranceEmployee +
      unemploymentInsuranceEmployee;

    const socialInsuranceEmployer =
      Math.min(basicSalary, SOCIAL_INSURANCE_CAP) *
      Number(config.socialInsuranceEmployerRate);
    const healthInsuranceEmployer =
      Math.min(basicSalary, SOCIAL_INSURANCE_CAP) *
      Number(config.healthInsuranceEmployerRate);
    const unemploymentInsuranceEmployer =
      Math.min(basicSalary, UNEMPLOYMENT_INSURANCE_CAP) *
      Number(config.unemploymentInsuranceEmployerRate);
    const totalInsuranceEmployer =
      socialInsuranceEmployer +
      healthInsuranceEmployer +
      unemploymentInsuranceEmployer;

    return {
      social_insurance_employee: socialInsuranceEmployee,
      health_insurance_employee: healthInsuranceEmployee,
      unemployment_insurance_employee: unemploymentInsuranceEmployee,
      social_insurance_employer: socialInsuranceEmployer,
      health_insurance_employer: healthInsuranceEmployer,
      unemployment_insurance_employer: unemploymentInsuranceEmployer,
      total_insurance_employee: totalInsuranceEmployee,
      total_insurance_employer: totalInsuranceEmployer,
    };
  }
}
