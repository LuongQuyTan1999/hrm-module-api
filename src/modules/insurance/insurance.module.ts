import { Module } from '@nestjs/common';
import { InsuranceService } from './insurance.service';
import { InsuranceController } from './insurance.controller';
import { PayrollConfigService } from '../payroll-config/payroll-config.service';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { PayrollConfig } from 'src/common/db/entities/payrollconfig.entity';

@Module({
  imports: [MikroOrmModule.forFeature([PayrollConfig])],
  controllers: [InsuranceController],
  providers: [InsuranceService, PayrollConfigService],
})
export class InsuranceModule {}
