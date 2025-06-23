import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { Employees } from 'src/common/db/entities/employee.entity';
import { Positions } from 'src/common/db/entities/position.entity';
import { PositionsController } from './positions.controller';
import { PositionsService } from './positions.service';

@Module({
  imports: [MikroOrmModule.forFeature([Positions, Employees])],
  controllers: [PositionsController],
  providers: [PositionsService],
})
export class PositionsModule {}
