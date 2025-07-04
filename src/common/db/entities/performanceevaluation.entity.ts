import {
  Entity,
  ManyToOne,
  type Opt,
  PrimaryKey,
  Property,
  type Ref,
} from '@mikro-orm/core';
import { Employees } from './employee.entity';

@Entity()
export class PerformanceEvaluations {
  @PrimaryKey({ type: 'uuid', defaultRaw: `uuid_generate_v4()` })
  id!: string & Opt;

  @ManyToOne({
    entity: () => Employees,
    ref: true,
    deleteRule: 'cascade',
    index: 'idx_performance_evaluations_employee_id',
  })
  employee!: Ref<Employees>;

  @Property({ length: 20 })
  evaluationPeriod!: string;

  @Property({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  kpiScore?: string;

  @Property({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  okrScore?: string;

  @Property({ type: 'text', nullable: true })
  comments?: string;

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
