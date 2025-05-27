import { Entity, ManyToOne, type Opt, PrimaryKey, Property, type Ref } from '@mikro-orm/core';
import { Users } from './user.entity';

@Entity()
export class Certificates {

  @PrimaryKey({ type: 'uuid', defaultRaw: `uuid_generate_v4()` })
  id!: string & Opt;

  @ManyToOne({ entity: () => Users, ref: true, deleteRule: 'cascade', index: 'idx_certificates_user_id' })
  user!: Ref<Users>;

  @Property({ nullable: true })
  certificateName?: string;

  @Property({ nullable: true })
  issuer?: string;

  @Property({ type: 'date', nullable: true })
  issueDate?: string;

  @Property({ type: 'date', nullable: true })
  expiryDate?: string;

  @Property({ columnType: 'timestamp(6)', nullable: true, defaultRaw: `CURRENT_TIMESTAMP` })
  createdAt?: Date;

  @Property({ columnType: 'timestamp(6)', nullable: true, defaultRaw: `CURRENT_TIMESTAMP` })
  updatedAt?: Date;

}
