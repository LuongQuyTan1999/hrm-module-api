import {
  Entity,
  ManyToOne,
  type Opt,
  PrimaryKey,
  Property,
  type Ref,
} from '@mikro-orm/core';
import { Departments } from './department.entity';
import { Positions } from './position.entity';

@Entity()
export class SalaryRules {
  @PrimaryKey({ type: 'uuid', defaultRaw: `uuid_generate_v4()` })
  id!: string & Opt;

  @ManyToOne({
    entity: () => Positions,
    ref: true,
    deleteRule: 'cascade',
    nullable: true,
    index: 'idx_salary_rules_position_id',
  })
  position?: Ref<Positions>;

  @ManyToOne({
    entity: () => Departments,
    ref: true,
    deleteRule: 'cascade',
    nullable: true,
    index: 'idx_salary_rules_department_id',
  })
  department?: Ref<Departments>;

  @Property({ type: 'decimal', precision: 15, scale: 2 })
  basicSalary!: string;

  @Property({ type: 'json', nullable: true })
  allowanceRule?: any;

  @Property({ type: 'json', nullable: true })
  bonusRule?: any;

  @Property({ type: 'json', nullable: true })
  deductionRule?: any;

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
