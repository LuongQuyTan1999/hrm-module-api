import { Module } from '@nestjs/common';
import { PayrollConfigService } from './payroll-config.service';
import { PayrollConfigController } from './payroll-config.controller';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { PayrollConfig } from 'src/common/db/entities/payrollconfig.entity';

@Module({
  imports: [MikroOrmModule.forFeature([PayrollConfig])],
  controllers: [PayrollConfigController],
  providers: [PayrollConfigService],
})
export class PayrollConfigModule {}
