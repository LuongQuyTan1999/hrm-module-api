/* eslint-disable @typescript-eslint/no-unsafe-return */
import { Injectable } from '@nestjs/common';
import { SalaryRules } from 'src/common/db/entities/salaryrule.entity';
import { InsuranceService } from 'src/modules/insurance/insurance.service';
import { TaxRecordsService } from 'src/modules/tax-records/tax-records.service';

@Injectable()
export class PayrollCalculatorService {
  constructor(
    private readonly taxService: TaxRecordsService,
    private readonly insuranceService: InsuranceService,
  ) {}

  private calculateTotalFromRule(rule: Record<string, number>): number {
    if (!rule) return 0;
    return Object.values(rule).reduce(
      (sum, value) => sum + Number(value || 0),
      0,
    );
  }

  async calculate(data: {
    salaryRule: SalaryRules;
    benefits: any;
    overtimeRate: number; // e.g., 150000
    overtimeMultiplier: number; // e.g., 1.5
    totalAdvanceAmount: number;
    attendanceRecords: any;
    periodEnd: string;
  }) {
    const {
      salaryRule,
      benefits,
      attendanceRecords,
      periodEnd,
      totalAdvanceAmount,
    } = data;

    const allowances = this.calculateTotalFromRule(salaryRule.allowanceRule);
    const bonuses = this.calculateTotalFromRule(salaryRule.bonusRule);
    const deductions = this.calculateTotalFromRule(salaryRule.deductionRule);

    const overtimeHours = attendanceRecords.reduce(
      (sum, record) => sum + (Number(record.overtimeHours) || 0),
      0,
    );
    const workingHours = attendanceRecords.reduce((sum, record) => {
      if (record.checkOut && record.checkIn) {
        return (
          sum + (record.checkOut.getTime() - record.checkIn.getTime()) / 3600000
        );
      }
      return sum;
    }, 0);

    const overtimeSalary =
      overtimeHours * data.overtimeRate * data.overtimeMultiplier;

    const insurance = await this.insuranceService.calculateInsurance(
      Number(salaryRule.basicSalary),
      periodEnd,
    );
    const totalInsuranceEmployee = insurance.total_insurance_employee;

    const dependentsCount = benefits?.value?.dependents_count || 0;

    const taxableIncome =
      Number(salaryRule.basicSalary) +
      allowances +
      bonuses +
      overtimeSalary -
      totalInsuranceEmployee -
      deductions;

    const { pit, taxRate } = await this.taxService.calculatePIT(
      taxableIncome,
      dependentsCount,
      periodEnd,
    );

    const netSalary = taxableIncome - pit - totalAdvanceAmount;

    return {
      basicSalary: Number(salaryRule.basicSalary),
      allowances,
      bonuses,
      overtimeHours,
      workingHours,
      overtimeSalary,
      insurance,
      pit,
      deductions,
      taxableIncome,
      netSalary,
      dependentsCount,
      taxRate,
    };
  }
}
