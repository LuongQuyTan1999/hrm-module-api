import { Entity, ManyToOne, type Opt, PrimaryKey, Property, type Ref } from '@mikro-orm/core';
import { Users } from './user.entity';

@Entity()
export class WorkHistory {

  @PrimaryKey({ type: 'uuid', defaultRaw: `uuid_generate_v4()` })
  id!: string & Opt;

  @ManyToOne({ entity: () => Users, ref: true, deleteRule: 'cascade', index: 'idx_work_history_user_id' })
  user!: Ref<Users>;

  @Property({ nullable: true })
  company?: string;

  @Property({ length: 100, nullable: true })
  position?: string;

  @Property({ type: 'date', nullable: true })
  startDate?: string;

  @Property({ type: 'date', nullable: true })
  endDate?: string;

  @Property({ type: 'text', nullable: true })
  description?: string;

  @Property({ columnType: 'timestamp(6)', nullable: true, defaultRaw: `CURRENT_TIMESTAMP` })
  createdAt?: Date;

  @Property({ columnType: 'timestamp(6)', nullable: true, defaultRaw: `CURRENT_TIMESTAMP` })
  updatedAt?: Date;

}
