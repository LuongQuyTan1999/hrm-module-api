import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { User } from 'src/modules/auth/entities/user.entity';
import * as dotenv from 'dotenv';

dotenv.config();

export const databaseConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  url: process.env.POSTGRES_URL,
  ssl: {
    rejectUnauthorized: false,
  },
  entities: [User],
  synchronize: true, // Only use in development
};
