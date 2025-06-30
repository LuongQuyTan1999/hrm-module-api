import { Migration } from '@mikro-orm/migrations';

export class Migration20250630074334_UpdateColumnForDepartmentsTable extends Migration {
  override async up(): Promise<void> {
    this.addSql(/*sql*/ `
      ALTER TABLE departments
      ADD COLUMN color VARCHAR(20) DEFAULT 'blue' NOT NULL,
      ADD COLUMN manager_name VARCHAR(100) NULL,
      ADD COLUMN manager_email VARCHAR(100) NULL;      
    `);
  }

  override async down(): Promise<void> {
    this.addSql(`select 1`);
  }
}
