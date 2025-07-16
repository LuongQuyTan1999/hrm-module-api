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
export class AdvanceRequests {
  @PrimaryKey({ type: 'uuid', defaultRaw: `uuid_generate_v4()` })
  id!: string & Opt;

  @ManyToOne({
    entity: () => Employees,
    ref: true,
    deleteRule: 'cascade',
    index: 'idx_advance_requests_employee_id',
  })
  employee!: Ref<Employees>;

  @Property({ type: 'decimal', precision: 15, scale: 2 })
  requestAmount!: string;

  @Property({ type: 'date', defaultRaw: `CURRENT_TIMESTAMP` })
  requestDate!: string & Opt;

  @Property({ length: 20 })
  status!: string;

  @Property({ type: 'text', nullable: true })
  reason?: string;

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

  @Property({ type: 'boolean', nullable: true })
  isUrgent?: boolean = false;

  @ManyToOne({
    entity: () => Employees,
    ref: true,
    deleteRule: 'cascade',
    nullable: true,
  })
  approver?: Ref<Employees>;

  @Property({ type: 'date', nullable: true })
  dueDate?: string;
}
