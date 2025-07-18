import { Migration } from '@mikro-orm/migrations';

export class Migration20250716153641_AddColumnAdvanceAmountToPayrollDetailsTable extends Migration {
  override async up(): Promise<void> {
    this.addSql(/*sql*/ `
      ALTER TABLE payroll_details
      ADD advance_amount NUMERIC(15, 2) DEFAULT 0;
    `);
  }

  override async down(): Promise<void> {
    this.addSql(`select 1`);
  }
}
