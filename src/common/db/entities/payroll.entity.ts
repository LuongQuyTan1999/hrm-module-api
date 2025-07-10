import {
  Entity,
  ManyToOne,
  type Opt,
  PrimaryKey,
  Property,
  type Ref,
} from '@mikro-orm/core';
import { Employees } from './employee.entity';

@Entity()
export class Payroll {
  @PrimaryKey({ type: 'uuid', defaultRaw: `uuid_generate_v4()` })
  id!: string & Opt;

  @ManyToOne({
    entity: () => Employees,
    ref: true,
    deleteRule: 'cascade',
    index: 'idx_payroll_employee_id',
  })
  employee!: Ref<Employees>;

  @Property({ type: 'date' })
  payPeriodStart!: string;

  @Property({ type: 'date' })
  payPeriodEnd!: string;

  @Property({ type: 'decimal', precision: 10, scale: 2 })
  basicSalary!: string;

  @Property({
    type: 'decimal',
    precision: 10,
    scale: 2,
    nullable: true,
    defaultRaw: `0`,
  })
  allowances?: string;

  @Property({
    type: 'decimal',
    precision: 10,
    scale: 2,
    nullable: true,
    defaultRaw: `0`,
  })
  bonuses?: string;

  @Property({
    type: 'decimal',
    precision: 10,
    scale: 2,
    nullable: true,
    defaultRaw: `0`,
  })
  deductions?: string;

  @Property({ type: 'decimal', precision: 10, scale: 2 })
  netSalary!: string;

  @Property({
    type: 'decimal',
    precision: 15,
    scale: 2,
    nullable: true,
    defaultRaw: `0`,
  })
  advanceAmount?: string;

  @Property({
    columnType: 'timestamp(6)',
    nullable: true,
    defaultRaw: `CURRENT_TIMESTAMP`,
  })
  paymentDate?: Date;

  @Property({
    type: 'decimal',
    precision: 10,
    scale: 2,
    nullable: true,
    defaultRaw: `0`,
  })
  overtimeSalary?: string;

  @Property({ length: 20, nullable: true, defaultRaw: `'pending'` })
  status?: string;

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
