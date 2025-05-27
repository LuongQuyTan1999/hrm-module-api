import { Entity, Property } from '@mikro-orm/core';
import { BaseEntity } from './base.entity';

@Entity()
export class Users extends BaseEntity {
  @Property({ index: 'idx_users_email', unique: 'users_email_key' })
  email!: string;

  @Property()
  password!: string;

  @Property()
  fullName!: string;

  @Property({ length: 50, index: 'idx_users_role' })
  role!: string;

  @Property({ type: 'boolean', nullable: true })
  isActive?: boolean = true;
}
