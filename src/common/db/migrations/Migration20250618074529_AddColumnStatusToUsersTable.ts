import { Migration } from '@mikro-orm/migrations';

export class Migration20250618074529_AddColumnStatusToUsersTable extends Migration {
  override async up(): Promise<void> {
    this.addSql(/*sql*/ `
      ALTER TABLE users
      ADD COLUMN status VARCHAR(20) NOT NULL DEFAULT 'active';   
    `);
  }

  override async down(): Promise<void> {
    this.addSql(`select 1`);
  }
}
