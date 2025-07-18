import { Controller } from '@nestjs/common';
import { TaxRecordsService } from './tax-records.service';

@Controller('tax-records')
export class TaxRecordsController {
  constructor(private readonly taxRecordsService: TaxRecordsService) {}
}
