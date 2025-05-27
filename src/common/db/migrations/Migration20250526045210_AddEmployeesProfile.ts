import { Migration } from '@mikro-orm/migrations';

export class Migration20250526045210_AddEmployeesProfile extends Migration {
  override async up(): Promise<void> {
    this.addSql(/*sql*/ `
      CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
      
      CREATE TABLE employees (
          id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
          user_id UUID NOT NULL,
          date_of_birth VARCHAR(255),
          address VARCHAR(255),
          phone VARCHAR(20),
          department VARCHAR(100),
          position VARCHAR(100),
          contract_type VARCHAR(255),
          contract_start DATE,
          contract_end DATE,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          created_by UUID NOT NULL,
          
          CONSTRAINT fk_employee_user FOREIGN KEY (user_id) 
              REFERENCES users(id) ON DELETE CASCADE,
          CONSTRAINT fk_employee_creator FOREIGN KEY (created_by) 
              REFERENCES users(id) ON DELETE CASCADE
      );

      CREATE TABLE work_history (
          id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
          user_id UUID NOT NULL,
          company VARCHAR(255),
          position VARCHAR(100),
          start_date DATE,
          end_date DATE,
          description TEXT,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          
          CONSTRAINT fk_work_history_user FOREIGN KEY (user_id)
              REFERENCES users(id) ON DELETE CASCADE
      );

      CREATE TABLE skills (
          id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
          user_id UUID NOT NULL,
          skill_name VARCHAR(100),
          proficiency VARCHAR(255),
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          
          CONSTRAINT fk_skills_user FOREIGN KEY (user_id)
              REFERENCES users(id) ON DELETE CASCADE
      );

      CREATE TABLE certificates (
          id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
          user_id UUID NOT NULL,
          certificate_name VARCHAR(255),
          issuer VARCHAR(255),
          issue_date DATE,
          expiry_date DATE,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          
          CONSTRAINT fk_certificates_user FOREIGN KEY (user_id)
              REFERENCES users(id) ON DELETE CASCADE
      );

      CREATE INDEX idx_employees_user_id ON employees(user_id);
      CREATE INDEX idx_employees_created_by ON employees(created_by);
      CREATE INDEX idx_work_history_user_id ON work_history(user_id);
      CREATE INDEX idx_skills_user_id ON skills(user_id);
      CREATE INDEX idx_certificates_user_id ON certificates(user_id);
      CREATE INDEX idx_employees_department ON employees(department);
      CREATE INDEX idx_skills_skill_name ON skills(skill_name);
    `);
  }

  override async down(): Promise<void> {
    this.addSql(`select 1`);
  }
}
