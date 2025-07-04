import { Migration } from '@mikro-orm/migrations';

export class Migration20250702023618_AddPayrollTable extends Migration {
  override async up(): Promise<void> {
    this.addSql(/*sql*/ `
      CREATE TABLE payroll (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        employee_id UUID NOT NULL,
        pay_period_start DATE NOT NULL,
        pay_period_end DATE NOT NULL,
        basic_salary NUMERIC(10, 2) NOT NULL,
        allowances NUMERIC(10, 2) DEFAULT 0,
        bonuses NUMERIC(10, 2) DEFAULT 0,
        deductions NUMERIC(10, 2) DEFAULT 0,
        net_salary NUMERIC(10, 2) NOT NULL,
        payment_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

        CONSTRAINT fk_payroll_employee
        FOREIGN KEY (employee_id) REFERENCES employees(id) ON DELETE CASCADE
      );

      CREATE UNIQUE INDEX idx_payroll_employee_id ON payroll(employee_id);
    `);
  }

  override async down(): Promise<void> {
    this.addSql(`select 1`);
  }
}
// CREATE INDEX idx_payroll_pay_period ON payroll(pay_period_start, pay_period_end);
