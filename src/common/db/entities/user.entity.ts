import {
  Entity,
  OneToOne,
  type Opt,
  PrimaryKey,
  Property,
  type Ref,
} from '@mikro-orm/core';
import { Employees } from './employee.entity';

@Entity()
export class Users {
  @PrimaryKey({ type: 'uuid', defaultRaw: `uuid_generate_v4()` })
  id!: string & Opt;

  @OneToOne({
    entity: () => Employees,
    ref: true,
    deleteRule: 'cascade',
    unique: 'idx_users_employee_id_unique',
  })
  employee!: Ref<Employees>;

  @Property()
  password!: string;

  @Property()
  username!: string;

  @Property({ length: 50 })
  role!: string;

  @Property({ columnType: 'timestamp(6)', nullable: true })
  lastLogin?: Date;

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
}
