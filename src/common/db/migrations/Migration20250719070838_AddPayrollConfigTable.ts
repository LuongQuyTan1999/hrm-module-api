import { Migration } from '@mikro-orm/migrations';

export class Migration20250719070838_AddPayrollConfigTable extends Migration {
  override async up(): Promise<void> {
    this.addSql(/*sql*/ `
        CREATE TABLE payroll_config (
          id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
          social_insurance_cap DECIMAL(15,2),
          health_insurance_cap DECIMAL(15,2),
          unemployment_insurance_cap DECIMAL(15,2),
          social_insurance_employee_rate DECIMAL(5,4),
          social_insurance_employer_rate DECIMAL(5,4),
          health_insurance_employee_rate DECIMAL(5,4),
          health_insurance_employer_rate DECIMAL(5,4),
          unemployment_insurance_employee_rate DECIMAL(5,4),
          unemployment_insurance_employer_rate DECIMAL(5,4),
          personal_exemption DECIMAL(15,2),
          dependent_exemption DECIMAL(15,2),
          tax_rates JSONB,
          overtime_base_rate DECIMAL(15,2),
          holiday_overtime_multiplier DECIMAL(5,2),
          effective_date DATE NOT NULL,
          expiry_date DATE,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
    `);
  }

  override async down(): Promise<void> {
    this.addSql(/*sql*/ `
      DROP TABLE IF EXISTS payroll_config CASCADE;
    `);
  }
}
