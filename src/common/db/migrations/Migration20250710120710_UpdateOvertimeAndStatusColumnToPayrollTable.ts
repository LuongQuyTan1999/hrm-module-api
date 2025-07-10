import { Migration } from '@mikro-orm/migrations';

export class Migration20250710120710_UpdateOvertimeAndStatusColumnToPayrollTable extends Migration {
  override async up(): Promise<void> {
    this.addSql(/*sql*/ `
      ALTER TABLE payroll
      ADD COLUMN overtime_salary DECIMAL(10, 2) DEFAULT 0 NOT NULL,
      ADD COLUMN status VARCHAR(20) DEFAULT 'pending' NOT NULL;
    `);
  }

  override async down(): Promise<void> {
    this.addSql(`select 1`);
  }
}
