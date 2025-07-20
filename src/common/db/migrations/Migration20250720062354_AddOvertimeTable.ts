import { Migration } from '@mikro-orm/migrations';

export class Migration20250720062354_AddOvertimeTable extends Migration {
  override async up(): Promise<void> {
    this.addSql(/*sql*/ `
      CREATE TABLE overtime (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        employee_id UUID NOT NULL,
        overtime_date DATE NOT NULL,
        overtime_hours DECIMAL(5,2) NOT NULL,
        shift_id UUID,
        status VARCHAR(20) DEFAULT 'pending' NOT NULL,
        approver_id UUID,
        reason TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

        CONSTRAINT fk_overtime_employee
        FOREIGN KEY (employee_id) REFERENCES employees(id) ON DELETE CASCADE,
        
        CONSTRAINT fk_overtime_shift
        FOREIGN KEY (shift_id) REFERENCES shift_configurations(id) ON DELETE SET NULL,
        
        CONSTRAINT fk_overtime_approver
        FOREIGN KEY (approver_id) REFERENCES employees(id) ON DELETE SET NULL
      );
    `);
  }

  override async down(): Promise<void> {
    this.addSql(/*sql*/ `
       DROP TABLE IF EXISTS overtime
    `);
  }
}
