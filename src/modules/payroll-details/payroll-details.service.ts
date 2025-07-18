import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PayrollDetails } from 'src/common/db/entities/payrolldetail.entity';
import { PayrollDetailsRepository } from './payroll-details.repository';

@Injectable()
export class PayrollDetailsService {
  constructor(private readonly PayrollDetailsRep: PayrollDetailsRepository) {}

  async getPayrollDetails(id: string): Promise<PayrollDetails> {
    try {
      const payroll = await this.PayrollDetailsRep.findOne(
        {
          payroll: id,
        },
        { populate: ['employee', 'employee.department', 'employee.position'] },
      );

      if (!payroll) {
        throw new NotFoundException(`Can't find payroll with id: ${id}`);
      }

      return payroll;
    } catch (error) {
      throw new BadRequestException(`Error: ${error.message}`);
    }
  }
}
