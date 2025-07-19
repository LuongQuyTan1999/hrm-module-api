import { Migration } from '@mikro-orm/migrations';

export class Migration20250704040609_AddSalaryRulesTable extends Migration {
  override async up(): Promise<void> {
    this.addSql(/*sql*/ `
      CREATE TABLE salary_rules (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        position_id UUID,
        department_id UUID,
        employee_id UUID,
        basic_salary NUMERIC(15, 2) NOT NULL,
        allowance_rule JSONB,
        bonus_rule JSONB,
        deduction_rule JSONB,
        effective_date DATE NOT NULL,
        expiry_date DATE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

        CONSTRAINT fk_salary_rules_position
        FOREIGN KEY (position_id) REFERENCES positions(id) ON DELETE SET NULL,
        CONSTRAINT fk_salary_rules_department
        FOREIGN KEY (department_id) REFERENCES departments(id) ON DELETE SET NULL,
        CONSTRAINT fk_salary_rules_employee
        FOREIGN KEY (employee_id) REFERENCES employees(id) ON DELETE SET NULL
      );

      CREATE INDEX idx_salary_rules_position_id ON salary_rules(position_id);
      CREATE INDEX idx_salary_rules_department_id ON salary_rules(department_id);
      CREATE INDEX idx_salary_rules_employee_id ON salary_rules(employee_id);
    `);
  }

  override async down(): Promise<void> {
    this.addSql(/*sql*/ `
      DROP TABLE IF EXISTS salary_rules CASCADE;
    `);
  }
}
