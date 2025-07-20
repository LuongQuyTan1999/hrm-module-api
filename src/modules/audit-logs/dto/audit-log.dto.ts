import { PartialType } from '@nestjs/mapped-types';

export class CreateAuditLogDto {}

export class UpdateAuditLogDto extends PartialType(CreateAuditLogDto) {}
