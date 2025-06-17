import { Injectable, OnModuleInit } from '@nestjs/common';
import { SqlDatabase } from 'langchain/sql_db';
import { QuerySqlTool } from 'langchain/tools/sql';
import databaseConfig from 'src/common/db/database.config';
import { DataSource } from 'typeorm';

@Injectable()
export class SqlDatabaseService implements OnModuleInit {
  private db: SqlDatabase;
  private dbChain: QuerySqlTool;
  private dataSource: DataSource;

  constructor() {}

  async onModuleInit() {
    await this.initializeDatabase();
  }

  private async initializeDatabase() {
    try {
      const connectionString = databaseConfig.clientUrl;

      if (!connectionString) {
        throw new Error('Database connection string not found in config');
      }

      this.dataSource = new DataSource({
        type: 'postgres',
        url: connectionString,
        entities: [],
        synchronize: false,
      });

      await this.dataSource.initialize();

      this.db = await SqlDatabase.fromDataSourceParams({
        appDataSource: this.dataSource,
        includesTables: ['employees', 'users'],
        sampleRowsInTableInfo: 1000000,
      });

      this.dbChain = new QuerySqlTool(this.db);
    } catch (error) {
      console.error('❌ Failed to initialize SQL Database:', error);
      throw error;
    }
  }

  async queryDatabase(query: string) {
    try {
      if (!this.dbChain) {
        throw new Error('Database chain not initialized');
      }

      console.log(`🤖 SQL Query for: ${query}`);

      const result = await this.dbChain.invoke(query);

      console.log('📊 SQL Chain result:', result);

      return {
        success: true,
        question: query,
        answer: result,
        method: 'fromDataSourceParams',
      };
    } catch (error) {
      console.error('❌ SQL Query error:', error);

      // Thêm thông tin debug
      const errorInfo = {
        message: error.message,
        query: error.query || 'Unknown',
        errorCode: error.code || 'Unknown',
      };

      return {
        success: false,
        error: error.message,
        question: query,
        errorDetails: errorInfo,
        suggestion: this.getSqlErrorSuggestion(error.message),
      };
    }
  }

  private getSqlErrorSuggestion(errorMessage: string): string {
    const message = errorMessage.toLowerCase();

    if (message.includes('syntax error at or near "```"')) {
      return 'SQL query chứa markdown code blocks. Đã được cleaned.';
    }

    if (message.includes('table') && message.includes('does not exist')) {
      return 'Bảng không tồn tại. Kiểm tra tên bảng trong database.';
    }

    if (message.includes('column') && message.includes('does not exist')) {
      return 'Cột không tồn tại. Kiểm tra schema của bảng.';
    }

    return 'Thử rephrase câu hỏi hoặc kiểm tra database schema.';
  }
}
