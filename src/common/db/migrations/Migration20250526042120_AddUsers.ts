import { Migration } from '@mikro-orm/migrations';

export class Migration20250526042120_AddUsers extends Migration {
  async up(): Promise<void> {
    this.addSql(/*sql*/ `
      CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
      
      CREATE TABLE users (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        full_name VARCHAR(255) NOT NULL,
        role VARCHAR(50) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        is_active BOOLEAN DEFAULT TRUE
      );
      
      CREATE INDEX idx_users_email ON users(email);
      CREATE INDEX idx_users_role ON users(role);
    `);
  }

  async down(): Promise<void> {
    this.addSql(`select 1`);
  }
}
