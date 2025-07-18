import { Body, Controller, Get, Param, Post, Put, Query } from '@nestjs/common';
import { Roles } from 'src/common/decorators/roles.decorator';
import { Role } from 'src/common/enum/role.enum';
import { AdvanceRequestsService } from './advance-requests.service';
import {
  AdvanceRequestsQueryDto,
  CreateAdvanceRequestsDto,
  UpdateAdvanceRequestsDto,
} from './dto/advance-request.dto';
import { Users } from 'src/common/db/entities/user.entity';
import { User } from 'src/common/decorators/user.decorator';

@Controller('advance-requests')
export class AdvanceRequestsController {
  constructor(
    private readonly advanceRequestsService: AdvanceRequestsService,
  ) {}

  @Get()
  @Roles(Role.ADMIN, Role.MANAGER)
  async getAllAdvanceRequests(@Query() query: AdvanceRequestsQueryDto) {
    return await this.advanceRequestsService.getAdvanceRequests(query);
  }

  @Post('')
  async createAdvanceRequests(@Body() body: CreateAdvanceRequestsDto) {
    return await this.advanceRequestsService.create(body);
  }

  @Put('/:id')
  @Roles(Role.ADMIN, Role.MANAGER)
  async updateAdvanceRequests(
    @Param('id') id: string,
    @Body() body: UpdateAdvanceRequestsDto,
    @User() user: Users,
  ) {
    return await this.advanceRequestsService.update(id, body, user);
  }

  @Get('total-advance/:employeeId')
  async getTotalAdvanceAmountByEmployeeId(
    @Param('employeeId') employeeId: string,
  ) {
    return await this.advanceRequestsService.getTotalAdvanceAmountByEmployeeId(
      employeeId,
    );
  }
}
