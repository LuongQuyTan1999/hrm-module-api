import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { InsuranceContributions } from 'src/common/db/entities/insurancecontribution.entity';
import { PayrollDetails } from 'src/common/db/entities/payrolldetail.entity';
import { TaxRecords } from 'src/common/db/entities/taxrecord.entity';
import { PayrollModule } from '../payroll/payroll.module';
import { PayrollDetailsController } from './payroll-details.controller';
import { PayrollDetailsService } from './payroll-details.service';
import { OvertimeModule } from '../overtime/overtime.module';

@Module({
  imports: [
    PayrollModule,
    MikroOrmModule.forFeature([
      PayrollDetails,
      InsuranceContributions,
      TaxRecords,
    ]),
    OvertimeModule,
  ],
  controllers: [PayrollDetailsController],
  providers: [PayrollDetailsService],
})
export class PayrollDetailsModule {}
