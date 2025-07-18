import {
  Entity,
  ManyToOne,
  type Opt,
  PrimaryKey,
  Property,
  type Ref,
} from '@mikro-orm/core';
import { PayrollDetailsRepository } from 'src/modules/payroll-details/payroll-details.repository';
import { Employees } from './employee.entity';
import { Payroll } from './payroll.entity';

@Entity({ repository: () => PayrollDetailsRepository })
export class PayrollDetails {
  @PrimaryKey({ type: 'uuid', defaultRaw: `uuid_generate_v4()` })
  id!: string & Opt;

  @ManyToOne({ entity: () => Payroll, ref: true, deleteRule: 'cascade' })
  payroll!: Ref<Payroll>;

  @ManyToOne({ entity: () => Employees, ref: true, deleteRule: 'cascade' })
  employee!: Ref<Employees>;

  @Property({ type: 'date' })
  periodStartDate!: string;

  @Property({ type: 'date' })
  periodEndDate!: string;

  @Property({ type: 'decimal', precision: 15, scale: 2 })
  basicSalary!: string;

  @Property({ type: 'json', nullable: true })
  allowances?: any;

  @Property({ type: 'json', nullable: true })
  bonuses?: any;

  @Property({ type: 'json', nullable: true })
  deductions?: any;

  @Property({
    type: 'decimal',
    precision: 5,
    scale: 2,
    nullable: true,
    defaultRaw: `0.0`,
  })
  overtimeHours?: string;

  @Property({ type: 'decimal', precision: 15, scale: 2, nullable: true })
  overtimeSalary?: string;

  @Property({ type: 'decimal', precision: 15, scale: 2 })
  netSalary!: string;

  @Property({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  workingHours?: string;

  @Property({ type: 'decimal', precision: 15, scale: 2, nullable: true })
  dailyRate?: string;

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
  createdAt?: Date;

  @Property({
    columnType: 'timestamp(6)',
    nullable: true,
    defaultRaw: `CURRENT_TIMESTAMP`,
  })
  updatedAt?: Date;
}
