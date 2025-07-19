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
export class EmployeeBenefits {
  @PrimaryKey({ type: 'uuid', defaultRaw: `uuid_generate_v4()` })
  id!: string & Opt;

  @ManyToOne({ entity: () => Employees, ref: true, deleteRule: 'cascade' })
  employee!: Ref<Employees>;

  @Property({ length: 50 })
  benefitType!: string;

  @Property({ type: 'json' })
  value!: any;

  @Property({ type: 'date' })
  effectiveDate!: string;

  @Property({ type: 'date', nullable: true })
  expiryDate?: string;

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
