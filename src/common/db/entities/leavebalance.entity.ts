import {
  Entity,
  Index,
  ManyToOne,
  type Opt,
  PrimaryKey,
  Property,
  type Ref,
} from '@mikro-orm/core';
import { Employees } from './employee.entity';

@Entity()
@Index({
  name: 'idx_leave_balances_employee_type_year',
  properties: ['employee', 'leaveType', 'year'],
})
export class LeaveBalances {
  @PrimaryKey({ type: 'uuid', defaultRaw: `uuid_generate_v4()` })
  id!: string & Opt;

  @ManyToOne({ entity: () => Employees, ref: true, deleteRule: 'cascade' })
  employee!: Ref<Employees>;

  @Property({ length: 50 })
  leaveType!: string;

  @Property({ type: 'decimal', precision: 5, scale: 2, defaultRaw: `0.0` })
  balanceDays!: string & Opt;

  @Property()
  year!: number;

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
