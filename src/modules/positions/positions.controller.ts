import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { CreatePositionDto } from './dto/create-position.dto';
import { UpdatePositionDto } from './dto/update-position.dto';
import { PositionsService } from './positions.service';

@Controller('positions')
export class PositionsController {
  constructor(private readonly positionsService: PositionsService) {}

  @Post()
  create(@Body() body: CreatePositionDto) {
    return this.positionsService.create(body);
  }

  @Get()
  findAll(@Query() query: { name?: string } & PaginationDto) {
    return this.positionsService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.positionsService.findOne(id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() body: UpdatePositionDto) {
    return this.positionsService.update(id, body);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.positionsService.delete(id);
  }
}
