import { Migration } from '@mikro-orm/migrations';

export class Migration20250704040703_AddPerformanceEvaluationsTable extends Migration {
  override async up(): Promise<void> {
    this.addSql(/*sql*/ `
      CREATE TABLE performance_evaluations (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        employee_id UUID NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
        evaluation_period VARCHAR(20) NOT NULL,
        kpi_score DECIMAL(5,2),
        okr_score DECIMAL(5,2),
        comments TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE INDEX idx_performance_evaluations_employee_id ON performance_evaluations(employee_id);
    `);
  }

  override async down(): Promise<void> {
    this.addSql(/*sql*/ `
      DROP TABLE IF EXISTS performance_evaluations CASCADE;
    `);
  }
}
