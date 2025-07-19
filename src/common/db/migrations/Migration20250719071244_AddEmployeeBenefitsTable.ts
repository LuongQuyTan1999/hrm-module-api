import { Migration } from '@mikro-orm/migrations';

export class Migration20250719071244_AddEmployeeBenefitsTable extends Migration {
  override async up(): Promise<void> {
    this.addSql(/*sql*/ `
      CREATE TABLE employee_benefits (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        employee_id UUID NOT NULL,
        benefit_type VARCHAR(50) NOT NULL,
        value JSONB NOT NULL,
        effective_date DATE NOT NULL,
        expiry_date DATE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

        CONSTRAINT fk_salary_rules_position
        FOREIGN KEY (employee_id) REFERENCES employees(id) ON DELETE CASCADE
      );
    `);
  }

  override async down(): Promise<void> {
    this.addSql(`select 1`);
  }
}
