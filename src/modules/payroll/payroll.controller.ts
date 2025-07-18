import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { Roles } from 'src/common/decorators/roles.decorator';
import { Role } from 'src/common/enum/role.enum';
import { CreatePayrollDto, PayrollQueryDto } from './dto/payroll.dto';
import { PayrollService } from './payroll.service';

@Controller('payrolls')
export class PayrollController {
  constructor(private readonly payrollService: PayrollService) {}

  @Post('')
  @Roles(Role.ADMIN, Role.MANAGER)
  async createPayroll(@Body() body: CreatePayrollDto) {
    return await this.payrollService.createPayroll(body);
  }

  @Get('')
  @Roles(Role.ADMIN, Role.MANAGER)
  async getPayrolls(@Query() query: PayrollQueryDto) {
    return await this.payrollService.getPayrolls(query);
  }
}
