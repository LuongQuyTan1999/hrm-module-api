import { Entity, ManyToOne, Property, type Ref } from '@mikro-orm/core';
import { BaseEntity } from './base.entity';
import { Users } from './user.entity';
import { EmployeeRepository } from 'src/modules/employees/employees.repository';

@Entity({ repository: () => EmployeeRepository })
export class Employees extends BaseEntity {
  @ManyToOne({
    entity: () => Users,
    ref: true,
    deleteRule: 'cascade',
    index: 'idx_employees_user_id',
  })
  user!: Ref<Users>;

  @Property({ nullable: true })
  dateOfBirth?: string;

  @Property({ nullable: true })
  address?: string;

  @Property({ length: 20, nullable: true })
  phone?: string;

  @Property({ length: 100, nullable: true, index: 'idx_employees_department' })
  department?: string;

  @Property({ length: 100, nullable: true })
  position?: string;

  @Property({ nullable: true })
  contractType?: string;

  @Property({ type: 'date', nullable: true })
  contractStart?: string;

  @Property({ type: 'date', nullable: true })
  contractEnd?: string;

  @ManyToOne({
    entity: () => Users,
    ref: true,
    fieldName: 'created_by',
    deleteRule: 'cascade',
    index: 'idx_employees_created_by',
  })
  createdBy!: Ref<Users>;
}
