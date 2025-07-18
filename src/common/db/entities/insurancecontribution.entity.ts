import {
  Entity,
  ManyToOne,
  type Opt,
  PrimaryKey,
  Property,
  type Ref,
} from '@mikro-orm/core';
import { Employees } from './employee.entity';
import { Payroll } from './payroll.entity';
import { InsuranceRepository } from 'src/modules/insurance/insurance.repository';

@Entity({ repository: () => InsuranceRepository })
export class InsuranceContributions {
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
  socialInsuranceEmployee!: string;

  @Property({ type: 'decimal', precision: 15, scale: 2 })
  healthInsuranceEmployee!: string;

  @Property({ type: 'decimal', precision: 15, scale: 2 })
  unemploymentInsuranceEmployee!: string;

  @Property({ type: 'decimal', precision: 15, scale: 2 })
  socialInsuranceEmployer!: string;

  @Property({ type: 'decimal', precision: 15, scale: 2 })
  healthInsuranceEmployer!: string;

  @Property({ type: 'decimal', precision: 15, scale: 2 })
  unemploymentInsuranceEmployer!: string;

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
