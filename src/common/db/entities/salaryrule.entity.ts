import {
  Entity,
  ManyToOne,
  type Opt,
  PrimaryKey,
  Property,
  type Ref,
} from '@mikro-orm/core';
import { Departments } from './department.entity';
import { Employees } from './employee.entity';
import { Positions } from './position.entity';

@Entity()
export class SalaryRules {
  @PrimaryKey({ type: 'uuid', defaultRaw: `uuid_generate_v4()` })
  id!: string & Opt;

  @ManyToOne({
    entity: () => Positions,
    ref: true,
    deleteRule: 'set null',
    nullable: true,
    index: 'idx_salary_rules_position_id',
  })
  position?: Ref<Positions>;

  @ManyToOne({
    entity: () => Departments,
    ref: true,
    deleteRule: 'set null',
    nullable: true,
    index: 'idx_salary_rules_department_id',
  })
  department?: Ref<Departments>;

  @ManyToOne({
    entity: () => Employees,
    ref: true,
    deleteRule: 'set null',
    nullable: true,
    index: 'idx_salary_rules_employee_id',
  })
  employee?: Ref<Employees>;

  @Property({ type: 'decimal', precision: 15, scale: 2 })
  basicSalary!: string;

  @Property({ type: 'json', nullable: true })
  allowanceRule?: any;

  @Property({ type: 'json', nullable: true })
  bonusRule?: any;

  @Property({ type: 'json', nullable: true })
  deductionRule?: any;

  @Property({ type: 'date' })
  effectiveDate!: string;

  @Property({ type: 'date', nullable: true })
  expiryDate?: string;

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
