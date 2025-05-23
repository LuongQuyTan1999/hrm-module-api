import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { User } from 'src/modules/auth/entities/user.entity';
import * as dotenv from 'dotenv';
import { Employee } from 'src/modules/employees/entities/employee-profile.entity';

dotenv.config();

export const databaseConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  url: process.env.POSTGRES_URL,
  ssl: {
    rejectUnauthorized: false,
  },
  entities: [User, Employee],
  synchronize: true, // Only use in development
};
