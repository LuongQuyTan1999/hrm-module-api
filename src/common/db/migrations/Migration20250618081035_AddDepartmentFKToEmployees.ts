import { Migration } from '@mikro-orm/migrations';

export class Migration20250618081035_AddDepartmentFKToEmployees extends Migration {
  override async up(): Promise<void> {
    this.addSql(/*sql*/ `
      INSERT INTO departments (id, name, description, created_at, updated_at)
      VALUES (
        uuid_generate_v4(),
        'IT', 
        'IT Department for managing technology and systems',
        CURRENT_TIMESTAMP,
        CURRENT_TIMESTAMP
      )
      ON CONFLICT (name) DO NOTHING;

      UPDATE employees 
      SET department_id = (
        SELECT id FROM departments WHERE name = 'IT' LIMIT 1
      )
      WHERE department_id NOT IN (SELECT id FROM departments);

      ALTER TABLE employees 
      ADD CONSTRAINT fk_employee_department 
      FOREIGN KEY (department_id) REFERENCES departments(id) ON DELETE RESTRICT;

      CREATE INDEX idx_employees_department_id ON employees(department_id);
    `);
  }

  override async down(): Promise<void> {
    this.addSql(/*sql*/ `
      DROP INDEX IF EXISTS idx_employees_department_id;
      ALTER TABLE employees DROP CONSTRAINT IF EXISTS fk_employee_department;
    `);
  }
}
