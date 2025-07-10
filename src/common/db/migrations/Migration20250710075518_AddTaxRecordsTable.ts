import { Migration } from '@mikro-orm/migrations';

export class Migration20250710075518_AddTaxRecordsTable extends Migration {
  override async up(): Promise<void> {
    this.addSql(/*sql*/ `
      CREATE TABLE tax_records (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        payroll_id UUID NOT NULL,
        employee_id UUID NOT NULL,
        period_start_date DATE NOT NULL,
        period_end_date DATE NOT NULL,
        taxable_income DECIMAL(15,2),
        pit DECIMAL(15,2),
        dependents INT DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        
        CONSTRAINT fk_tax_records_payroll FOREIGN KEY (payroll_id) REFERENCES payroll(id) ON DELETE CASCADE,
        CONSTRAINT fk_tax_records_employee FOREIGN KEY (employee_id) REFERENCES employees(id) ON DELETE CASCADE
      );
    `);
  }

  override async down(): Promise<void> {
    this.addSql(`select 1`);
  }
}
