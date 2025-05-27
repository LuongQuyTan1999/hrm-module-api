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
export class Skills {
  @PrimaryKey({ type: 'uuid', defaultRaw: `uuid_generate_v4()` })
  id!: string & Opt;

  @ManyToOne({
    entity: () => Users,
    ref: true,
    deleteRule: 'cascade',
    index: 'idx_skills_user_id',
  })
  user!: Ref<Users>;

  @Property({ length: 100, nullable: true, index: 'idx_skills_skill_name' })
  skillName?: string;

  @Property({ nullable: true })
  proficiency?: string;

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
