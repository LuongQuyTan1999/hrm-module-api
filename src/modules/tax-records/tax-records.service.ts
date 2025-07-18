import { Injectable } from '@nestjs/common';

@Injectable()
export class TaxRecordsService {
  constructor() {}

  calculatePIT(taxableIncome: number, dependents) {
    const PERSONAL_EXEMPTION = 11000000; // 11M VND
    const DEPENDENT_EXEMPTION = 4400000; // 4.4M VND

    const taxableIncomeAfterExemption = Math.max(
      taxableIncome - PERSONAL_EXEMPTION - dependents * DEPENDENT_EXEMPTION,
      0,
    );

    let pit = 0;
    if (taxableIncomeAfterExemption <= 5000000) {
      pit = taxableIncomeAfterExemption * 0.05;
    } else if (taxableIncomeAfterExemption <= 10000000) {
      pit = 250000 + (taxableIncomeAfterExemption - 5000000) * 0.1;
    } else if (taxableIncomeAfterExemption <= 18000000) {
      pit = 750000 + (taxableIncomeAfterExemption - 10000000) * 0.15;
    } else if (taxableIncomeAfterExemption <= 32000000) {
      pit = 1950000 + (taxableIncomeAfterExemption - 18000000) * 0.2;
    } else if (taxableIncomeAfterExemption <= 52000000) {
      pit = 4750000 + (taxableIncomeAfterExemption - 32000000) * 0.25;
    } else if (taxableIncomeAfterExemption <= 80000000) {
      pit = 9750000 + (taxableIncomeAfterExemption - 52000000) * 0.3;
    } else {
      pit = 18150000 + (taxableIncomeAfterExemption - 80000000) * 0.35;
    }

    return pit;
  }
}
