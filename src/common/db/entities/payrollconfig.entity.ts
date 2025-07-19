import { Entity, type Opt, PrimaryKey, Property } from '@mikro-orm/core';

@Entity()
export class PayrollConfig {
  @PrimaryKey({ type: 'uuid', defaultRaw: `uuid_generate_v4()` })
  id!: string & Opt;

  @Property({ type: 'decimal', precision: 15, scale: 2, nullable: true })
  socialInsuranceCap?: string;

  @Property({ type: 'decimal', precision: 15, scale: 2, nullable: true })
  healthInsuranceCap?: string;

  @Property({ type: 'decimal', precision: 15, scale: 2, nullable: true })
  unemploymentInsuranceCap?: string;

  @Property({ type: 'decimal', precision: 5, scale: 4, nullable: true })
  socialInsuranceEmployeeRate?: string;

  @Property({ type: 'decimal', precision: 5, scale: 4, nullable: true })
  socialInsuranceEmployerRate?: string;

  @Property({ type: 'decimal', precision: 5, scale: 4, nullable: true })
  healthInsuranceEmployeeRate?: string;

  @Property({ type: 'decimal', precision: 5, scale: 4, nullable: true })
  healthInsuranceEmployerRate?: string;

  @Property({ type: 'decimal', precision: 5, scale: 4, nullable: true })
  unemploymentInsuranceEmployeeRate?: string;

  @Property({ type: 'decimal', precision: 5, scale: 4, nullable: true })
  unemploymentInsuranceEmployerRate?: string;

  @Property({ type: 'decimal', precision: 15, scale: 2, nullable: true })
  personalExemption?: string;

  @Property({ type: 'decimal', precision: 15, scale: 2, nullable: true })
  dependentExemption?: string;

  @Property({ type: 'json', nullable: true })
  taxRates?: any;

  @Property({ type: 'decimal', precision: 15, scale: 2, nullable: true })
  overtimeBaseRate?: string;

  @Property({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  holidayOvertimeMultiplier?: string;

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
