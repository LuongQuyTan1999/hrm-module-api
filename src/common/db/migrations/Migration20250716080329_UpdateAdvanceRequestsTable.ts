import { Migration } from '@mikro-orm/migrations';

export class Migration20250716080329_UpdateAdvanceRequestsTable extends Migration {
  override async up(): Promise<void> {
    this.addSql(/*sql*/ `
      ALTER TABLE advance_requests 
      ADD is_urgent BOOLEAN DEFAULT FALSE,
      ADD approver_id UUID NULL,
      ADD due_date DATE,
      ALTER COLUMN request_date TYPE DATE,
      ALTER COLUMN request_date SET NOT NULL,
      ADD CONSTRAINT fk_advance_requests_approver
      FOREIGN KEY (approver_id) REFERENCES employees(id) ON DELETE CASCADE;
    `);
  }

  override async down(): Promise<void> {
    this.addSql(`select 1`);
  }
}
