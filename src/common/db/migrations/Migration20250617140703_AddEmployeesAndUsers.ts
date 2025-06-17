import { Migration } from '@mikro-orm/migrations';

export class Migration20250617140703_AddEmployeesAndUsers extends Migration {
  override async up(): Promise<void> {
    this.addSql(/*sql*/ `
      CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
      
      CREATE TABLE employees (
          id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
          employee_code VARCHAR(20) UNIQUE,       
          first_name VARCHAR(100) NOT NULL,
          last_name VARCHAR(100) NOT NULL,
          date_of_birth DATE NOT NULL,
          gender VARCHAR(50),
          address VARCHAR(255),
          phone_number VARCHAR(20),
          email VARCHAR(255) UNIQUE NOT NULL,
          hire_date DATE,
          department_id UUID NOT NULL,
          position_id UUID NOT NULL,
          contract_type VARCHAR(255),
          contract_start DATE,
          contract_end DATE,
          bank_account VARCHAR(50),
          bank_name VARCHAR(100),
          tax_code VARCHAR(50),
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          created_by UUID
      );

      CREATE TABLE users (
          id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),       
          employee_id UUID NOT NULL UNIQUE,   
          password VARCHAR(255) NOT NULL,
          username VARCHAR(255) NOT NULL,
          role VARCHAR(50) NOT NULL,
          last_login TIMESTAMP,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

          CONSTRAINT fk_users_employee FOREIGN KEY (employee_id)
              REFERENCES employees(id) ON DELETE CASCADE
      );

      CREATE UNIQUE INDEX idx_users_employee_id_unique ON users(employee_id);
    `);
  }

  override async down(): Promise<void> {
    this.addSql(`select 1`);
  }
}
