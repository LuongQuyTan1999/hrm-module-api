import { Controller } from '@nestjs/common';
import { SalariesService } from './salaries.service';

@Controller('salaries')
export class SalariesController {
  constructor(private readonly salariesService: SalariesService) {}
}
