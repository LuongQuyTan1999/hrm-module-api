export type LeaveType =
  | 'annual'
  | 'sick'
  | 'casual'
  | 'maternity'
  | 'paternity'
  | 'remote'
  | 'other';

export type StatusType = 'pending' | 'approved' | 'rejected';

export class RequestDto {
  employeeId: string;
  leaveType: LeaveType;
  startDate: string;
  endDate: string;
  reason: string;
  status: StatusType;
  createdAt?: Date;
  updatedAt?: Date;
}

export class CreateLeaveBalanceDto {
  employeeId: string;
  leaveType: LeaveType;
  balance_days: number;
  year: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export class RecordDto {
  employeeId: string;
  shiftId: string;
  checkIn: Date;
  checkOut: Date | null;
  status: 'checked_in' | 'checked_out';
}
