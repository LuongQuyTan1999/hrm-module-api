import {
  Entity,
  type Opt,
  PrimaryKey,
  Property,
  Unique,
} from '@mikro-orm/core';
import { DepartmentsRepository } from 'src/modules/departments/departments.repository';

@Entity({ repository: () => DepartmentsRepository })
export class Departments {
  @PrimaryKey({ type: 'uuid', defaultRaw: `uuid_generate_v4()` })
  id!: string & Opt;

  @Unique({ name: 'idx_departments_name_unique' })
  @Property({ length: 100, unique: 'departments_name_key' })
  name!: string;

  @Property({ type: 'text', nullable: true })
  description?: string;

  @Property({
    columnType: 'timestamp(6)',
    nullable: true,
    defaultRaw: `CURRENT_TIMESTAMP`,
  })
  createdAt?: Date;

  @Property({
    columnType: 'timestamp(6)',
    nullable: true,
    defaultRaw: `CURRENT_TIMESTAMP`,
  })
  updatedAt?: Date;

  @Property({ type: 'string', length: 20 })
  color: string & Opt = 'blue';

  @Property({ length: 100, nullable: true })
  managerName?: string;

  @Property({ length: 100, nullable: true })
  managerEmail?: string;
}
