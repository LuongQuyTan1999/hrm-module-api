import { Migration } from '@mikro-orm/migrations';

export class Migration20250630074707_UpdateColumnForPositionsTable extends Migration {
  override async up(): Promise<void> {
    this.addSql(/*sql*/ `
      ALTER TABLE positions
      ADD COLUMN level VARCHAR(50) NULL,
      ADD COLUMN min_salary NUMERIC(10, 2) NULL,
      ADD COLUMN max_salary NUMERIC(10, 2) NULL;
    `);
  }

  override async down(): Promise<void> {
    this.addSql(`select 1`);
  }
}
