import {
  Entity,
  ManyToOne,
  type Opt,
  PrimaryKey,
  Property,
  type Ref,
  Unique,
} from '@mikro-orm/core';
import { Departments } from './department.entity';

@Entity()
export class Positions {
  @PrimaryKey({ type: 'uuid', defaultRaw: `uuid_generate_v4()` })
  id!: string & Opt;

  @Unique({ name: 'positions_name_key' })
  @Property({ length: 100, unique: 'idx_positions_name_unique' })
  name!: string;

  @Property({ type: 'text', nullable: true })
  description?: string;

  @ManyToOne({ entity: () => Departments, ref: true })
  department!: Ref<Departments>;

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
