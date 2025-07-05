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
      ADD COLUMN shift_id UUID NOT NULL,
      ADD CONSTRAINT fk_attendance_shift_id
        FOREIGN KEY (shift_id) REFERENCES shift_configurations(id) ON DELETE SET NULL;
      ;
      

      CREATE INDEX idx_shift_name ON shift_configurations(name);
    `);
  }

  override async down(): Promise<void> {
    this.addSql(/*sql*/ `
      DROP TABLE IF EXISTS shift_configurations CASCADE;
    `);
  }
}
