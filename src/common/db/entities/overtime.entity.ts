import {
  Entity,
  ManyToOne,
  type Opt,
  PrimaryKey,
  Property,
  type Ref,
} from '@mikro-orm/core';
import { Employees } from './employee.entity';
import { ShiftConfigurations } from './shiftconfiguration.entity';

@Entity()
export class Overtime {
  @PrimaryKey({ type: 'uuid', defaultRaw: `uuid_generate_v4()` })
  id!: string & Opt;

  @ManyToOne({ entity: () => Employees, ref: true, deleteRule: 'cascade' })
  employee!: Ref<Employees>;

  @Property({ type: 'date' })
  overtimeDate!: string;

  @Property({ type: 'decimal', precision: 5, scale: 2 })
  overtimeHours!: string;

  @ManyToOne({
    entity: () => ShiftConfigurations,
    ref: true,
    deleteRule: 'set null',
    nullable: true,
  })
  shift?: Ref<ShiftConfigurations>;

  @Property({ type: 'string', length: 20 })
  status: string & Opt = 'pending';

  @ManyToOne({
    entity: () => Employees,
    ref: true,
    deleteRule: 'set null',
    nullable: true,
  })
  approver?: Ref<Employees>;

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
