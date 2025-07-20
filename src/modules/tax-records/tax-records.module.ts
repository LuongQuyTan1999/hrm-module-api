import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { PayrollConfig } from 'src/common/db/entities/payrollconfig.entity';
import { PayrollConfigService } from '../payroll-config/payroll-config.service';
import { TaxRecordsController } from './tax-records.controller';
import { TaxRecordsService } from './tax-records.service';

@Module({
  imports: [MikroOrmModule.forFeature([PayrollConfig])],
  controllers: [TaxRecordsController],
  providers: [TaxRecordsService, PayrollConfigService],
})
export class TaxRecordsModule {}
