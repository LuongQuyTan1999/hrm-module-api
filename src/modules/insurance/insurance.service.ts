import { Injectable } from '@nestjs/common';

@Injectable()
export class InsuranceService {
  constructor() {}

  calculateInsurance(basicSalary: number) {
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
}
