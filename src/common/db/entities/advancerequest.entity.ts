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

  @Property({
    type: 'datetime',
    columnType: 'timestamp(6)',
    defaultRaw: `CURRENT_TIMESTAMP`,
  })
  requestDate!: Date & Opt;

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
}
