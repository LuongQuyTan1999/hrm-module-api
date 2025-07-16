import { Body, Controller, Get, Param, Post, Put, Query } from '@nestjs/common';
import { PayrollService } from './payroll.service';
import { Roles } from 'src/common/decorators/roles.decorator';
import { Role } from 'src/common/enum/role.enum';
import { CalculatorPayrollDto, PayrollQueryDto } from './dto/payroll.dto';
import {
  AdvanceRequestsQueryDto,
  CreateAdvanceRequestsDto,
  UpdateAdvanceRequestsDto,
} from './dto/advance-requests.dto';
import { AdvanceRequestsService } from './services/advance-requests.service';
import { User } from 'src/common/decorators/user.decorator';
import { Users } from 'src/common/db/entities/user.entity';

@Controller('payroll')
export class PayrollController {
  constructor(
    private readonly payrollService: PayrollService,
    private readonly advanceRequestsService: AdvanceRequestsService,
  ) {}

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

  @Get('/advance-requests')
  @Roles(Role.ADMIN, Role.MANAGER)
  async getAllAdvanceRequests(@Query() query: AdvanceRequestsQueryDto) {
    return await this.advanceRequestsService.getAdvanceRequests(query);
  }

  @Get('/advance-requests/total-advance/:employeeId')
  async getTotalAdvanceAmountByEmployeeId(
    @Param('employeeId') employeeId: string,
  ) {
    return await this.advanceRequestsService.getTotalAdvanceAmountByEmployeeId(
      employeeId,
    );
  }

  @Post('/advance-requests')
  async createAdvanceRequests(@Body() body: CreateAdvanceRequestsDto) {
    return await this.advanceRequestsService.create(body);
  }

  @Put('/advance-requests/:id')
  @Roles(Role.ADMIN, Role.MANAGER)
  async updateAdvanceRequests(
    @Param('id') id: string,
    @Body() body: UpdateAdvanceRequestsDto,
    @User() user: Users,
  ) {
    return await this.advanceRequestsService.update(id, body, user);
  }
}
