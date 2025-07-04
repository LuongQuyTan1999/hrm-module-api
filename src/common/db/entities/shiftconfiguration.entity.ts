import { Entity, type Opt, PrimaryKey, Property } from '@mikro-orm/core';

@Entity()
export class ShiftConfigurations {
  @PrimaryKey({ type: 'uuid', defaultRaw: `uuid_generate_v4()` })
  id!: string & Opt;

  @Property({ length: 50, index: 'idx_shift_name' })
  name!: string;

  @Property({ type: 'time', columnType: 'time(6)' })
  startTime!: string;

  @Property({ type: 'time', columnType: 'time(6)' })
  endTime!: string;

  @Property({
    type: 'decimal',
    precision: 4,
    scale: 2,
    nullable: true,
    defaultRaw: `1.0`,
  })
  overtimeMultiplier?: string;

  @Property({ type: 'text', nullable: true })
  description?: string;

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
