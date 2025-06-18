import { Migration } from '@mikro-orm/migrations';

export class Migration20250618080609_AddDepartmentsTable extends Migration {
  override async up(): Promise<void> {
    this.addSql(/*sql*/ `
      CREATE TABLE departments (
          id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
          name VARCHAR(100) NOT NULL UNIQUE,
          description TEXT,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE UNIQUE INDEX idx_departments_name_unique ON departments(name);
    `);
  }

  override async down(): Promise<void> {
    this.addSql(`select 1`);
  }
}
