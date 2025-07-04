import {
  Entity,
  Enum,
  ManyToOne,
  OneToOne,
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

  @OneToOne({
    entity: () => Employees,
    ref: true,
    deleteRule: 'cascade',
    unique: 'idx_attendance_employee_id',
  })
  employee!: Ref<Employees>;

  @Property({ columnType: 'timestamp(6)' })
  checkIn!: Date;

  @Property({ columnType: 'timestamp(6)', nullable: true })
  checkOut?: Date;

  @Enum({ items: () => AttendanceStatus })
  status!: AttendanceStatus;

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
    nullable: true,
  })
  shift?: Ref<ShiftConfigurations>;

  @Property({
    type: 'decimal',
    precision: 5,
    scale: 2,
    nullable: true,
    defaultRaw: `0.0`,
  })
  overtimeHours?: string;
}

export enum AttendanceStatus {
  PRESENT = 'present',
  ABSENT = 'absent',
  LATE = 'late',
  ON_LEAVE = 'on_leave',
}
