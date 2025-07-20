import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository } from '@mikro-orm/postgresql';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PayrollConfig } from 'src/common/db/entities/payrollconfig.entity';

@Injectable()
export class PayrollConfigService {
  constructor(
    @InjectRepository(PayrollConfig)
    private readonly payrollConfigRep: EntityRepository<PayrollConfig>,
  ) {}
  async getPayrollConfig(periodEnd: string): Promise<PayrollConfig> {
    try {
      const config = await this.payrollConfigRep.findOne({
        effectiveDate: { $lte: periodEnd },
        $or: [{ expiryDate: { $gte: periodEnd } }, { expiryDate: null }],
      });

      if (!config) {
        throw new NotFoundException(`Can't find config`);
      }

      return config;
    } catch (error) {
      throw new BadRequestException(`Error: ${error.message}`);
    }
  }
}
