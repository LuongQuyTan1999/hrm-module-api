import { PartialType } from '@nestjs/mapped-types';
import { CreateTaxRecordDto } from './create-tax-record.dto';

export class UpdateTaxRecordDto extends PartialType(CreateTaxRecordDto) {}
