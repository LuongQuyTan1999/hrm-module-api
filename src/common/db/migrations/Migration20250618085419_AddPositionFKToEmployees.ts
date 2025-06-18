import { Migration } from '@mikro-orm/migrations';

export class Migration20250618085419_AddPositionFKToEmployees extends Migration {
  override async up(): Promise<void> {
    this.addSql(/*sql*/ `
      ALTER TABLE employees 
      ADD CONSTRAINT fk_employee_position 
      FOREIGN KEY (position_id) REFERENCES positions(id) ON DELETE RESTRICT;

      CREATE INDEX idx_employees_position_id ON employees(position_id);
    `);
  }

  override async down(): Promise<void> {
    this.addSql(/*sql*/ `
      DROP INDEX IF EXISTS idx_employees_position_id;
      ALTER TABLE employees DROP CONSTRAINT IF EXISTS fk_employee_position;
    `);
  }
}
