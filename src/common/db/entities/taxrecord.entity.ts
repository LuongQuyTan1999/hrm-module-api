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
import { TaxRecordsRepository } from 'src/modules/tax-records/payroll.repository';

@Entity({ repository: () => TaxRecordsRepository })
export class TaxRecords {
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

  @Property({ type: 'decimal', precision: 15, scale: 2, nullable: true })
  taxableIncome?: string;

  @Property({ type: 'decimal', precision: 15, scale: 2, nullable: true })
  pit?: string;

  @Property({ type: 'integer', nullable: true })
  dependents?: number = 0;

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
