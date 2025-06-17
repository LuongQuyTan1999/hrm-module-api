// src/modules/ai/services/langchain.service.ts
import { ChatOpenAI } from '@langchain/openai';
import { Injectable } from '@nestjs/common';
import { initializeAgentExecutorWithOptions } from 'langchain/agents';
import { SqlDatabase } from 'langchain/sql_db';
import { EmployeesService } from '../employees/employees.service';
import { ERROR_MESSAGES, SYSTEM_PROMPT } from './constants/prompts';
import { SqlDatabaseService } from './services/sql-database.service';
import { createSqlQueryTool } from './tools/sql-query.tool';
import { ChatResponse } from './types/ai.types';

@Injectable()
export class AiService {
  private llm: ChatOpenAI;
  private db: SqlDatabase;
  private tools: any[];

  constructor(
    private readonly employeesService: EmployeesService,
    private readonly sqlDatabaseService: SqlDatabaseService,
  ) {
    this.llm = new ChatOpenAI({
      model: 'gpt-4o-mini',
      temperature: 0,
      apiKey: process.env.OPENAI_API_KEY,
      maxRetries: 1,
    });

    this.tools = [
      //   createSearchEmployeesTool(this.employeesService),
      //   createUpdateEmployeeTool(this.employeesService),
      createSqlQueryTool(this.sqlDatabaseService),
    ];
  }

  async chat(message: string): Promise<ChatResponse> {
    try {
      const executor = await initializeAgentExecutorWithOptions(
        this.tools,
        this.llm,
        {
          agentType: 'openai-functions',
          verbose: true,
        },
      );

      const result = await executor.invoke({
        input: message,
        system: SYSTEM_PROMPT,
      });

      return {
        success: true,
        message: result.output,
        toolCalls: result.toolCalls || [],
        conversation: [
          { role: 'user', content: message },
          { role: 'assistant', content: result.output },
        ],
      };
    } catch (error) {
      console.error('LangChain Error:', error);
      return {
        success: false,
        message: ERROR_MESSAGES.GENERAL_ERROR,
        error: error.message,
      };
    }
  }
}
