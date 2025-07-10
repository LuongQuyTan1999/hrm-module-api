import { Migration } from '@mikro-orm/migrations';

export class Migration20250710074116_AddPayrollDetailsTable extends Migration {
  override async up(): Promise<void> {
    this.addSql(/*sql*/ `
      CREATE TABLE payroll_details (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        payroll_id UUID NOT NULL,
        employee_id UUID NOT NULL,
        period_start_date DATE NOT NULL,
        period_end_date DATE NOT NULL,
        basic_salary NUMERIC(15, 2) NOT NULL,
        allowances JSONB,
        bonuses JSONB,
        deductions JSONB,
        overtime_hours DECIMAL(5, 2) DEFAULT 0.0,
        overtime_salary NUMERIC(15, 2),
        net_salary NUMERIC(15, 2) NOT NULL,
        working_hours DECIMAL(5, 2),
        daily_rate DECIMAL(15, 2),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

        CONSTRAINT fk_details_payroll FOREIGN KEY (payroll_id) REFERENCES payroll(id) ON DELETE CASCADE,
        CONSTRAINT fk_details_employee FOREIGN KEY (employee_id) REFERENCES employees(id) ON DELETE CASCADE
      );
    `);
  }

  override async down(): Promise<void> {
    this.addSql(/*sql*/ `
      DROP TABLE IF EXISTS payroll_details;
    `);
  }
}
