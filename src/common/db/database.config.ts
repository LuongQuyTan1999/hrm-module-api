import { Options } from '@mikro-orm/core';
import { PostgreSqlDriver } from '@mikro-orm/postgresql';
import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config();

const databaseConfig: Options<PostgreSqlDriver> = {
  driver: PostgreSqlDriver,
  clientUrl: process.env.POSTGRES_URL,
  entities: ['./dist/common/db/entities/*.entity.js'],
  debug: process.env.NODE_ENV !== 'production',
  // disableIdentityMap: true,
  // namingStrategy: UnderscoreNamingStrategy,

  discovery: {
    warnWhenNoEntities: false,
    requireEntitiesArray: false,
    alwaysAnalyseProperties: true,
  },

  driverOptions: {
    connection: {
      ssl: {
        rejectUnauthorized: false,
      },
    },
  },

  entityGenerator: {
    bidirectionalRelations: false,
    identifiedReferences: true,

    fileName: (entityName) => {
      let name = entityName.toLowerCase();
      if (name.endsWith('s')) {
        name = name.slice(0, -1);
      }

      if (name === 'workhistory') {
        name = 'work-history';
      }

      return `${name}.entity`;
    },
  },

  migrations: {
    tableName: 'mikro_orm_migrations',
    path: './dist/common/db/migrations',
    pathTs: './src/common/db/migrations',
    glob: '!(*.d).{js,ts}',
    transactional: true,
    disableForeignKeys: false,
    allOrNothing: true,
    dropTables: true,
    safe: false,
    snapshot: true,
    emit: 'ts',
  },

  seeder: {
    path: path.join(__dirname, './seeders'),
    pathTs: path.join(__dirname, '../src/seeders'),
    defaultSeeder: 'DatabaseSeeder',
    glob: '!(*.d).{js,ts}',
  },
};

export default databaseConfig;
