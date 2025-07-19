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
        component_type VARCHAR(50) NOT NULL, -- allowance, bonus, deduction
        component_name VARCHAR(100) NOT NULL, -- e.g., lunch, performance, union_fee
        amount DECIMAL(15,2) NOT NULL,
        description TEXT,
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
