import {
  BaseEntity,
  Entity,
  ManyToOne,
  type Opt,
  PrimaryKey,
  Property,
  type Ref,
} from '@mikro-orm/core';
import { Departments } from './department.entity';
import { Positions } from './position.entity';
import { EmployeeRepository } from 'src/modules/employees/employees.repository';

@Entity({ repository: () => EmployeeRepository })
export class Employees extends BaseEntity {
  @PrimaryKey({ type: 'uuid', defaultRaw: `uuid_generate_v4()` })
  id!: string & Opt;

  @Property({
    length: 20,
    nullable: true,
    unique: 'employees_employee_code_key',
  })
  employeeCode: string;

  @Property({ length: 100 })
  firstName!: string;

  @Property({ length: 100 })
  lastName!: string;

  @Property({ type: 'date' })
  dateOfBirth!: string;

  @Property({ length: 50, nullable: true })
  gender?: string;

  @Property({ nullable: true })
  address?: string;

  @Property({ length: 20, nullable: true })
  phoneNumber?: string;

  @Property({ unique: 'employees_email_key' })
  email!: string;

  @Property({ type: 'date', nullable: true })
  hireDate?: string;

  @ManyToOne({
    entity: () => Departments,
    ref: true,
    index: 'idx_employees_department_id',
  })
  department!: Ref<Departments>;

  @ManyToOne({
    entity: () => Positions,
    ref: true,
    index: 'idx_employees_position_id',
  })
  position!: Ref<Positions>;

  @Property({ nullable: true })
  contractType?: string;

  @Property({ type: 'date', nullable: true })
  contractStart?: string;

  @Property({ type: 'date', nullable: true })
  contractEnd?: string;

  @Property({ length: 50, nullable: true })
  bankAccount?: string;

  @Property({ length: 100, nullable: true })
  bankName?: string;

  @Property({ length: 50, nullable: true })
  taxCode?: string;

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

  @Property({ type: 'uuid', nullable: true })
  createdBy?: string;
}
