import { Injectable } from '@nestjs/common';
import {
  CreateLeaveBalanceDto,
  RecordDto,
  RequestDto,
} from './dto/attendance.dto';
import { AttendanceQueryDto } from './dto/query.dto';
import { LeaveBalanceService } from './services/leave-balance.service';
import { LeaveRequestService } from './services/leave-request.service';
import { RecordService } from './services/record.service';
import { Users } from 'src/common/db/entities/user.entity';

@Injectable()
export class AttendanceService {
  constructor(
    private readonly leaveRequestService: LeaveRequestService,
    private readonly leaveBalanceService: LeaveBalanceService,
    private readonly recordService: RecordService,
  ) {}

  async request(body: RequestDto) {
    return await this.leaveRequestService.create(body);
  }

  async updateRequest(id: string, body: Partial<RequestDto>) {
    return await this.leaveRequestService.update(id, body);
  }

  async getAllRequests(queryParams: AttendanceQueryDto) {
    return await this.leaveRequestService.findAll(queryParams);
  }

  async createLeaveBalance(body: CreateLeaveBalanceDto) {
    return await this.leaveBalanceService.create(body);
  }

  async getLeaveBalance(employeeId: string) {
    return await this.leaveBalanceService.getByEmployeeId(employeeId);
  }

  async recordAttendance(body: RecordDto, currentUser: Users) {
    return await this.recordService.recordAttendance(body, currentUser);
  }
}
