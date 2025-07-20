import { Injectable } from '@nestjs/common';
import { PayrollConfigService } from '../payroll-config/payroll-config.service';

@Injectable()
export class TaxRecordsService {
  constructor(private readonly payrollConfigSer: PayrollConfigService) {}

  async calculatePIT(
    taxableIncome: number,
    dependentsCount,
    periodEnd: string,
  ) {
    const config = await this.payrollConfigSer.getPayrollConfig(periodEnd);

    const PERSONAL_EXEMPTION = Number(config.personalExemption); // 11M VND
    const DEPENDENT_EXEMPTION = Number(config.dependentExemption); // 4.4M VND

    const taxableIncomeAfterExemption = Math.max(
      taxableIncome -
        PERSONAL_EXEMPTION -
        dependentsCount * DEPENDENT_EXEMPTION,
      0,
    );

    let pit = 0;
    let taxRate = 0;

    if (taxableIncomeAfterExemption > 0) {
      const taxRates = config.taxRates || [];
      let remainingIncome = taxableIncomeAfterExemption;
      for (const { threshold, rate } of taxRates) {
        if (remainingIncome > 0) {
          const taxableAtThisRate = Math.min(remainingIncome, threshold);
          pit += taxableAtThisRate * rate;
          taxRate = rate;
          remainingIncome -= taxableAtThisRate;
        }
      }
    }

    return { pit, taxRate };
  }
}
