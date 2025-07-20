import { Controller } from '@nestjs/common';
import { PayrollConfigService } from './payroll-config.service';

@Controller('payroll-config')
export class PayrollConfigController {
  constructor(private readonly payrollConfigService: PayrollConfigService) {}
}
