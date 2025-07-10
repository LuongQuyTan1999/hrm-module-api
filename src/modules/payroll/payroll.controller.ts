import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { PayrollService } from './payroll.service';
import { Roles } from 'src/common/decorators/roles.decorator';
import { Role } from 'src/common/enum/role.enum';
import { CalculatorPayrollDto, PayrollQueryDto } from './dto/payroll.dto';

@Controller('payroll')
export class PayrollController {
  constructor(private readonly payrollService: PayrollService) {}

  @Post('calculate')
  @Roles(Role.ADMIN, Role.MANAGER)
  async calculatePayroll(@Body() body: CalculatorPayrollDto) {
    return await this.payrollService.calculatePayroll(body);
  }

  @Get('payrolls')
  @Roles(Role.ADMIN, Role.MANAGER)
  async getPayrolls(@Query() query: PayrollQueryDto) {
    return await this.payrollService.getPayrolls(query);
  }
}
