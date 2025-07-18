import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { AdvanceRequests } from 'src/common/db/entities/advancerequest.entity';
import { EmployeesModule } from '../employees/employees.module';
import { AdvanceRequestsController } from './advance-requests.controller';
import { AdvanceRequestsService } from './advance-requests.service';

@Module({
  imports: [MikroOrmModule.forFeature([AdvanceRequests]), EmployeesModule],
  controllers: [AdvanceRequestsController],
  providers: [AdvanceRequestsService],
})
export class AdvanceRequestsModule {}
