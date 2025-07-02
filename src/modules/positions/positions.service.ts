import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityManager, EntityRepository } from '@mikro-orm/postgresql';
import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Departments } from 'src/common/db/entities/department.entity';
import { Employees } from 'src/common/db/entities/employee.entity';
import { Positions } from 'src/common/db/entities/position.entity';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { CreatePositionDto } from './dto/create-position.dto';
import { UpdatePositionDto } from './dto/update-position.dto';
import { PositionsRepository } from './positions.repository';

@Injectable()
export class PositionsService {
  constructor(
    @InjectRepository(Positions)
    private readonly positionRepository: PositionsRepository,
    @InjectRepository(Employees)
    private readonly employeeRepository: EntityRepository<Employees>,
    private readonly em: EntityManager,
  ) {}

  async create(body: CreatePositionDto) {
    await this.validateUniqueName(body.name);

    const position = this.positionRepository.create({
      department: this.em.getReference(Departments, body.departmentId),
      ...body,
    });

    await this.em.persistAndFlush(position);

    return position;
  }

  async findAll(
    queryParams: {
      name?: string;
    } & PaginationDto,
  ): Promise<{
    items: Positions[];
    total: number;
    page: number;
    limit: number;
    pageCount: number;
  }> {
    const positions = this.positionRepository.findAllAndPaginate(queryParams);

    return positions;
  }

  async findOne(id: string): Promise<Positions> {
    return this.positionRepository.findOneWithEmployeeCount(id);
  }

  async update(id: string, body: UpdatePositionDto): Promise<Positions> {
    const position = await this.positionRepository.findOne(id);

    if (!position) {
      throw new BadRequestException(`Không tìm thấy vị trí với ID ${id}`);
    }

    if (body.name && body.name !== position.name) {
      await this.validateUniqueName(body.name);
    }

    Object.assign(position, body);

    await this.em.persistAndFlush(position);

    return position;
  }

  async delete(id: string): Promise<{ message: string }> {
    const position = await this.positionRepository.findOne(id);

    if (!position) {
      throw new BadRequestException(`Không tìm thấy vị trí với ID ${id}`);
    }

    await this.validatePositionCanBeDeleted(id);

    await this.em.removeAndFlush(position);

    return { message: `Đã xóa vị trí với ID ${id}` };
  }

  private async validateUniqueName(name: string): Promise<void> {
    const existingPosition = await this.positionRepository.findOne({
      name: { $ilike: name },
    });

    if (existingPosition) {
      throw new ForbiddenException(`Vị trí "${name}" đã tồn tại`);
    }
  }

  private async validatePositionCanBeDeleted(
    positionId: string,
  ): Promise<void> {
    const employeeCount = await this.employeeRepository.count({
      position: positionId,
    });

    if (employeeCount > 0) {
      throw new BadRequestException(
        `Không thể xóa vị trí này vì có ${employeeCount} nhân viên đang thuộc vị trí. ` +
          `Vui lòng chuyển nhân viên sang vị trí khác trước khi xóa.`,
      );
    }
  }
}
