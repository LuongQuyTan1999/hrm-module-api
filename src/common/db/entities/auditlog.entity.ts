import {
  Entity,
  ManyToOne,
  type Opt,
  PrimaryKey,
  Property,
  type Ref,
} from '@mikro-orm/core';
import { Users } from './user.entity';

@Entity()
export class AuditLogs {
  @PrimaryKey({ type: 'uuid', defaultRaw: `uuid_generate_v4()` })
  id!: string & Opt;

  @ManyToOne({
    entity: () => Users,
    ref: true,
    deleteRule: 'set null',
    index: 'idx_audit_logs_user_id',
  })
  user!: Ref<Users>;

  @Property({ length: 100 })
  action!: string;

  @Property({ length: 50, nullable: true })
  entityName?: string;

  @Property({ nullable: true })
  entityId?: string;

  @Property({ type: 'json', nullable: true })
  details?: any;

  @Property({
    columnType: 'timestamp(6)',
    nullable: true,
    defaultRaw: `CURRENT_TIMESTAMP`,
  })
  createdAt?: Date;
}
