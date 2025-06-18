import { Migration } from '@mikro-orm/migrations';

export class Migration20250618084820_AddPositionsTable extends Migration {
  override async up(): Promise<void> {
    this.addSql(/*sql*/ `
      CREATE TABLE positions (
          id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
          name VARCHAR(100) NOT NULL UNIQUE,
          description TEXT,
          department_id UUID NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

          CONSTRAINT fk_position_department
          FOREIGN KEY (department_id) REFERENCES departments(id) ON DELETE RESTRICT
      );

      CREATE UNIQUE INDEX idx_positions_name_unique ON positions(name);
    `);
  }

  override async down(): Promise<void> {
    this.addSql(/*sql*/ `
      DROP TABLE IF EXISTS positions CASCADE;
    `);
  }
}
