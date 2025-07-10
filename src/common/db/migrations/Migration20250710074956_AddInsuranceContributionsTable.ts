import { Migration } from '@mikro-orm/migrations';

export class Migration20250710074956_AddInsuranceContributionsTable extends Migration {
  override async up(): Promise<void> {
    this.addSql(/*sql*/ `
      CREATE TABLE insurance_contributions (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        payroll_id UUID NOT NULL,
        employee_id UUID NOT NULL,
        period_start_date DATE NOT NULL,
        period_end_date DATE NOT NULL,
        social_insurance_employee NUMERIC(15, 2) NOT NULL,
        health_insurance_employee NUMERIC(15, 2) NOT NULL,
        unemployment_insurance_employee NUMERIC(15, 2) NOT NULL,
        social_insurance_employer NUMERIC(15, 2) NOT NULL,
        health_insurance_employer NUMERIC(15, 2) NOT NULL,
        unemployment_insurance_employer NUMERIC(15, 2) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

        CONSTRAINT fk_insurance_contributions_payroll FOREIGN KEY (payroll_id) REFERENCES payroll(id) ON DELETE CASCADE,
        CONSTRAINT fk_insurance_contributions_employee FOREIGN KEY (employee_id) REFERENCES employees(id) ON DELETE CASCADE
      );
    `);
  }

  override async down(): Promise<void> {
    this.addSql(/*sql*/ `
      DROP TABLE IF EXISTS insurance_contributions;
    `);
  }
}
