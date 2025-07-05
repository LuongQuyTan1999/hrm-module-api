import { Migration } from '@mikro-orm/migrations';

export class Migration20250704071259_AddLeaveTable extends Migration {
  override async up(): Promise<void> {
    this.addSql(/*sql*/ `
      CREATE TABLE leave_requests (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        employee_id UUID NOT NULL,
        leave_type VARCHAR(50) NOT NULL,
        start_date DATE NOT NULL,
        end_date DATE NOT NULL,
        reason TEXT,
        status VARCHAR(20) NOT NULL DEFAULT 'pending',
        approver_id UUID NULL REFERENCES employees(id) ON DELETE SET NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

        CONSTRAINT fk_leave_requests_employee
        FOREIGN KEY (employee_id) REFERENCES employees(id) ON DELETE CASCADE
      );

      CREATE TABLE leave_balances (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        employee_id UUID NOT NULL,
        leave_type VARCHAR(50) NOT NULL,
        balance_days NUMERIC(5, 2) NOT NULL DEFAULT 0.0,
        year INT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

        CONSTRAINT fk_leave_balances_employee
        FOREIGN KEY (employee_id) REFERENCES employees(id) ON DELETE CASCADE
      );

      CREATE INDEX idx_leave_requests_employee_date ON leave_requests(employee_id, start_date, end_date);
      CREATE INDEX idx_leave_balances_employee_type_year ON leave_balances(employee_id, leave_type, year);
    `);
  }

  override async down(): Promise<void> {
    this.addSql(/*sql*/ `
      DROP TABLE IF EXISTS leave_requests;
      DROP TABLE IF EXISTS leave_balances;
    `);
  }
}
