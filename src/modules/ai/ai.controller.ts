// src/modules/ai/ai.controller.ts
import { Body, Controller, Post } from '@nestjs/common';
import { Public } from 'src/common/decorators/public.decorator';
import { AiService } from './ai.service';
import { SqlDatabaseService } from './services/sql-database.service';

export class ChatDto {
  message: string;
}

@Controller('ai')
export class AiController {
  constructor(
    private readonly AiService: AiService,
    private readonly sqlDatabaseService: SqlDatabaseService,
  ) {}

  @Post('chat')
  @Public()
  async chat(@Body() chatDto: ChatDto) {
    return this.AiService.chat(chatDto.message);
  }
}
