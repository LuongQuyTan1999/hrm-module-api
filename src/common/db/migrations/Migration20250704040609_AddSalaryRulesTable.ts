import { Migration } from '@mikro-orm/migrations';

export class Migration20250704040609_AddSalaryRulesTable extends Migration {
  override async up(): Promise<void> {
    this.addSql(/*sql*/ `
      CREATE TABLE salary_rules (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        position_id UUID NULL REFERENCES positions(id) ON DELETE CASCADE,
        department_id UUID NULL REFERENCES departments(id) ON DELETE CASCADE,
        basic_salary NUMERIC(15, 2) NOT NULL,
        allowance_rule JSONB,
        bonus_rule JSONB,
        deduction_rule JSONB,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE INDEX idx_salary_rules_position_id ON salary_rules(position_id);
      CREATE INDEX idx_salary_rules_department_id ON salary_rules(department_id);
    `);
  }

  override async down(): Promise<void> {
    this.addSql(/*sql*/ `
      DROP TABLE IF EXISTS salary_rules CASCADE;
    `);
  }
}
