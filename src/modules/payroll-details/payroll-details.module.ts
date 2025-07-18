import { Module } from '@nestjs/common';
import { PayrollDetailsService } from './payroll-details.service';
import { PayrollDetailsController } from './payroll-details.controller';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { PayrollDetails } from 'src/common/db/entities/payrolldetail.entity';

@Module({
  imports: [MikroOrmModule.forFeature([PayrollDetails])],
  controllers: [PayrollDetailsController],
  providers: [PayrollDetailsService],
})
export class PayrollDetailsModule {}
