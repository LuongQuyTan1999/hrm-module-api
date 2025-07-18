/* eslint-disable @typescript-eslint/no-unsafe-return */
import { Injectable } from '@nestjs/common';
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

  public calculate(data: {
    basicSalary: number;
    allowanceRule: any;
    bonusRule: any;
    deductionRule: any;
    overtimeRate: number; // e.g., 150000
    overtimeMultiplier: number; // e.g., 1.5
    dependents: number;
    totalAdvanceAmount: number;
    attendanceRecords: any;
  }) {
    const allowances = this.calculateTotalFromRule(data.allowanceRule);
    const bonuses = this.calculateTotalFromRule(data.bonusRule);
    const unionFee = Number(data.deductionRule.unionFee || 0);

    const overtimeHours = data.attendanceRecords.reduce(
      (sum, record) => sum + (Number(record.overtimeHours) || 0),
      0,
    );
    const workingHours = data.attendanceRecords.reduce((sum, record) => {
      if (record.checkOut && record.checkIn) {
        return (
          sum + (record.checkOut.getTime() - record.checkIn.getTime()) / 3600000
        );
      }
      return sum;
    }, 0);

    const overtimeSalary =
      overtimeHours * data.overtimeRate * data.overtimeMultiplier;

    const insurance = this.insuranceService.calculateInsurance(
      data.basicSalary,
    );
    const totalInsuranceEmployee = insurance.total_insurance_employee;

    const taxableIncome =
      data.basicSalary +
      allowances +
      bonuses +
      overtimeSalary -
      totalInsuranceEmployee -
      unionFee;

    const pit = this.taxService.calculatePIT(taxableIncome, data.dependents);

    const netSalary = taxableIncome - pit - data.totalAdvanceAmount;

    return {
      basicSalary: data.basicSalary,
      allowances,
      bonuses,
      overtimeHours,
      workingHours,
      overtimeSalary,
      insurance,
      pit,
      unionFee,
      taxableIncome,
      netSalary,
    };
  }
}
