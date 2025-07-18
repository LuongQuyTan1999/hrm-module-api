import { Module } from '@nestjs/common';
import { TaxRecordsService } from './tax-records.service';
import { TaxRecordsController } from './tax-records.controller';

@Module({
  controllers: [TaxRecordsController],
  providers: [TaxRecordsService],
})
export class TaxRecordsModule {}
