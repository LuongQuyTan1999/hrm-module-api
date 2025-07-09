import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityManager, EntityRepository } from '@mikro-orm/postgresql';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Attendance } from 'src/common/db/entities/attendance.entity';
import { AuditLogs } from 'src/common/db/entities/auditlog.entity';
import { Users } from 'src/common/db/entities/user.entity';
import { EmployeeValidationService } from 'src/modules/employees/services/employee-validation.service';
import { RecordDto } from '../dto/attendance.dto';
import { Employees } from 'src/common/db/entities/employee.entity';
import { ShiftConfigurations } from 'src/common/db/entities/shiftconfiguration.entity';

@Injectable()
export class RecordService {
  constructor(
    @InjectRepository(Attendance)
    private readonly attendanceRepository: EntityRepository<Attendance>,
    @InjectRepository(AuditLogs)
    private readonly auditLogsRepository: EntityRepository<AuditLogs>,
    private readonly employeeValidationService: EmployeeValidationService,

    private readonly em: EntityManager,
  ) {}

  async checkIn(body: RecordDto, currentUser: Users): Promise<Attendance> {
    try {
      await this.employeeValidationService.validateEmployeeExists(
        body.employeeId,
      );

      const attendance = this.attendanceRepository.create({
        employee: this.em.getReference(Employees, body.employeeId),
        shift: this.em.getReference(ShiftConfigurations, body.shiftId),
        checkIn: new Date(body.checkIn),
        checkOut: body.checkOut ? new Date(body.checkOut) : null,
        status: body.status,
        location: 'Da nang',
      });

      await this.em.transactional(async (transactionalEM) => {
        // After creating, the triggers will handle status updates
        // Check in attendance_after_update trigger
        await transactionalEM.persistAndFlush(attendance);

        const auditLog = this.auditLogsRepository.create({
          user: this.em.getReference(Users, currentUser.id),
          action: 'Check In',
          entityName: 'Attendance',
          entityId: attendance.id, // ✅ Now has valid ID
          details: {
            employeeId: body.employeeId,
            checkIn: new Date(body.checkIn),
            checkOut: body.checkOut ? new Date(body.checkOut) : null,
            status: body.status,
            shiftId: body.shiftId,
          },
        });

        // ✅ Persist audit log
        await transactionalEM.persistAndFlush(auditLog);
      });

      return attendance;
    } catch (error) {
      throw new BadRequestException(
        `Failed to record attendance: ${error.message}`,
      );
    }
  }

  async checkout(
    attendanceId: string,
    body: Partial<RecordDto>,
    currentUser: Users,
  ): Promise<Attendance> {
    try {
      const attendance = await this.attendanceRepository.findOne(attendanceId);

      if (!attendance) {
        throw new NotFoundException('Attendance record not found');
      }

      Object.assign(attendance, body);

      await this.em.transactional(async (transactionalEM) => {
        // After creating, the triggers will handle status updates
        // Check in attendance_after_update trigger
        await transactionalEM.persistAndFlush(attendance);

        const auditLog = this.auditLogsRepository.create({
          user: this.em.getReference(Users, currentUser.id),
          action: 'Check Out',
          entityName: 'Attendance',
          entityId: attendance.id,
          details: {
            employeeId: attendance.employee.id,
            checkIn: attendance.checkIn,
            checkOut: attendance.checkOut,
            status: attendance.status,
            shiftId: attendance.shift?.id,
          },
        });
        // ✅ Persist audit log
        await transactionalEM.persistAndFlush(auditLog);
      });
      return attendance;
    } catch (error) {
      throw new BadRequestException(
        `Failed to checkout attendance: ${error.message}`,
      );
    }
  }
}
