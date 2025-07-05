import { Migration } from '@mikro-orm/migrations';

export class Migration20250702022726_AddAttendanceTable extends Migration {
  override async up(): Promise<void> {
    this.addSql(/*sql*/ `
      CREATE TABLE attendance (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        employee_id UUID NOT NULL,
        check_in TIMESTAMP NOT NULL,
        check_out TIMESTAMP,
        status VARCHAR(20) NOT NULL,
        overtime_hours DECIMAL(5,2) DEFAULT 0.0,
        location VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

        CONSTRAINT fk_attendance_employee
        FOREIGN KEY (employee_id) REFERENCES employees(id) ON DELETE CASCADE
      );

      CREATE INDEX idx_attendance_employee_id ON attendance(employee_id);
    `);
  }

  override async down(): Promise<void> {
    this.addSql(/*sql*/ `
      DROP TABLE IF EXISTS attendance CASCADE;
    `);
  }
}
