import { Migration } from '@mikro-orm/migrations';

export class Migration20250704042656_AddShiftConfigurationsTable extends Migration {
  override async up(): Promise<void> {
    this.addSql(/*sql*/ `
      CREATE TABLE shift_configurations (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        name VARCHAR(50) NOT NULL,
        start_time TIME NOT NULL,
        end_time TIME NOT NULL,
        overtime_multiplier DECIMAL(4,2) DEFAULT 1.0,
        description TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      ALTER TABLE attendance
      ADD COLUMN shift_id UUID REFERENCES shift_configurations(id) ON DELETE SET NULL,
      ADD COLUMN overtime_hours DECIMAL(5,2) DEFAULT 0.0,
      DROP COLUMN IF EXISTS shift_type;

      ALTER TABLE payroll
      ADD COLUMN advance_amount DECIMAL(15,2) DEFAULT 0;

      CREATE INDEX idx_shift_name ON shift_configurations(name);
    `);
  }

  override async down(): Promise<void> {
    this.addSql(/*sql*/ `
      DROP TABLE IF EXISTS shift_configurations CASCADE;
    `);
  }
}
