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
export class Attendance {
  @PrimaryKey({ type: 'uuid', defaultRaw: `uuid_generate_v4()` })
  id!: string & Opt;

  @ManyToOne({
    entity: () => Employees,
    ref: true,
    deleteRule: 'cascade',
    index: 'idx_attendance_employee_id',
  })
  employee!: Ref<Employees>;

  @Property({ columnType: 'timestamp(6)' })
  checkIn!: Date;

  @Property({ columnType: 'timestamp(6)', nullable: true })
  checkOut?: Date;

  @Property({ length: 20 })
  status!: string;

  @Property({
    type: 'decimal',
    precision: 5,
    scale: 2,
    nullable: true,
    defaultRaw: `0.0`,
  })
  overtimeHours?: string;

  @Property()
  location!: string;

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

  @ManyToOne({
    entity: () => ShiftConfigurations,
    ref: true,
    deleteRule: 'set null',
  })
  shift!: Ref<ShiftConfigurations>;
}
