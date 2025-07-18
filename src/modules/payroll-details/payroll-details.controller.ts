import { Controller, Get, Param } from '@nestjs/common';
import { PayrollDetailsService } from './payroll-details.service';

@Controller('payroll-details')
export class PayrollDetailsController {
  constructor(private readonly payrollDetailsSer: PayrollDetailsService) {}

  @Get('/:id')
  async getPayroll(@Param('id') id: string) {
    return await this.payrollDetailsSer.getPayrollDetails(id);
  }
}
