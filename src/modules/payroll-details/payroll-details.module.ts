import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { PayrollDetails } from 'src/common/db/entities/payrolldetail.entity';
import { PayrollModule } from '../payroll/payroll.module';
import { PayrollDetailsController } from './payroll-details.controller';
import { PayrollDetailsService } from './payroll-details.service';
import { InsuranceContributions } from 'src/common/db/entities/insurancecontribution.entity';
import { TaxRecords } from 'src/common/db/entities/taxrecord.entity';

@Module({
  imports: [
    PayrollModule,
    MikroOrmModule.forFeature([
      PayrollDetails,
      InsuranceContributions,
      TaxRecords,
    ]),
  ],
  controllers: [PayrollDetailsController],
  providers: [PayrollDetailsService],
})
export class PayrollDetailsModule {}
