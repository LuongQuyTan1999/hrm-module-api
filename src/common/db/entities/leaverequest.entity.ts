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
  name: 'idx_leave_requests_employee_date',
  properties: ['employee', 'startDate', 'endDate'],
})
export class LeaveRequests {
  @PrimaryKey({ type: 'uuid', defaultRaw: `uuid_generate_v4()` })
  id!: string & Opt;

  @ManyToOne({ entity: () => Employees, ref: true, deleteRule: 'cascade' })
  employee!: Ref<Employees>;

  @Property({ length: 50 })
  leaveType!: string;

  @Property({ type: 'date' })
  startDate!: string;

  @Property({ type: 'date' })
  endDate!: string;

  @Property({ type: 'text', nullable: true })
  reason?: string;

  @Property({ type: 'string', length: 20 })
  status: string & Opt = 'pending';

  @ManyToOne({
    entity: () => Employees,
    ref: true,
    deleteRule: 'set null',
    nullable: true,
  })
  approver?: Ref<Employees>;

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
