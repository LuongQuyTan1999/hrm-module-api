import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Query,
  Req,
} from '@nestjs/common';
import { Roles } from 'src/common/decorators/roles.decorator';
import { Role } from 'src/common/enum/role.enum';
import { AttendanceService } from './attendance.service';
import {
  CreateLeaveBalanceDto,
  LeaveTypeEnum,
  RecordDto,
  RequestDto,
} from './dto/attendance.dto';
import { AttendanceQueryDto } from './dto/query.dto';
import { Users } from 'src/common/db/entities/user.entity';

@Controller('attendance')
export class AttendanceController {
  constructor(private readonly attendanceService: AttendanceService) {}

  @Post('request')
  create(@Body() body: RequestDto) {
    return this.attendanceService.request(body);
  }

  @Post('request/:id')
  updateRequest(@Body() body: Partial<RequestDto>, @Param('id') id: string) {
    return this.attendanceService.updateRequest(id, body);
  }

  @Get('request')
  @Roles(Role.ADMIN, Role.MANAGER)
  getAllRequests(@Query() query: AttendanceQueryDto) {
    return this.attendanceService.getAllRequests({
      ...query,
      excludeLeaveTypes: [LeaveTypeEnum.REMOTE],
    });
  }

  @Get('request/remote')
  @Roles(Role.ADMIN, Role.MANAGER)
  getRemoteRequests(@Query() query: AttendanceQueryDto) {
    return this.attendanceService.getAllRequests({
      ...query,
      leaveType: LeaveTypeEnum.REMOTE,
    });
  }

  @Post('leave-balance')
  createLeaveBalance(@Body() body: CreateLeaveBalanceDto) {
    return this.attendanceService.createLeaveBalance(body);
  }

  @Get('leave-balance/:employeeId')
  @Roles(Role.ADMIN, Role.MANAGER)
  getLeaveBalance(@Param('employeeId') employeeId: string) {
    return this.attendanceService.getLeaveBalance(employeeId);
  }

  @Post('check-in')
  checkIn(@Body() body: RecordDto, @Req() req: { user: Users }) {
    return this.attendanceService.checkIn(body, req.user);
  }

  @Put('check-out/:id')
  checkout(
    @Param('id') id: string,
    @Body() body: Partial<RecordDto>,
    @Req() req: { user: Users },
  ) {
    return this.attendanceService.checkout(id, body, req.user);
  }
}
