import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityManager, EntityRepository } from '@mikro-orm/postgresql';
import { Injectable } from '@nestjs/common';
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

  async recordAttendance(body: RecordDto, currentUser: Users) {
    await this.employeeValidationService.validateEmployeeExists(
      body.employeeId,
    );

    const attendance = this.attendanceRepository.create({
      employee: this.em.getReference(Employees, body.employeeId),
      shift: this.em.getReference(ShiftConfigurations, body.shiftId),
      checkIn: body.checkIn,
      checkOut: body.checkOut,
      status: body.status,
      location: 'Da nang',
    });

    await this.em.transactional(async (transactionalEM) => {
      await transactionalEM.persistAndFlush(attendance);

      const auditLog = this.auditLogsRepository.create({
        user: this.em.getReference(Users, currentUser.id),
        action: body.status === 'checked_in' ? 'Check In' : 'Check Out',
        entityName: 'Attendance',
        entityId: attendance.id, // ✅ Now has valid ID
        details: {
          employeeId: body.employeeId,
          checkIn: body.checkIn,
          checkOut: body.checkOut,
          status: body.status,
          shiftId: body.shiftId,
        },
      });

      // ✅ Persist audit log
      await transactionalEM.persistAndFlush(auditLog);
    });

    // await this.em.populate(attendance, ['employee', 'shift']);

    return attendance;
  }
}
