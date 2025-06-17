import { z } from 'zod';
import { tool } from '@langchain/core/tools';
import { SqlDatabaseService } from '../services/sql-database.service';

export function createSqlQueryTool(sqlDatabaseService: SqlDatabaseService) {
  return tool(
    async ({ question }) => {
      try {
        console.log(`🔍 SQL Tool received question: ${question}`);

        // Validate question
        if (!question || question.trim().length === 0) {
          return '❌ Vui lòng cung cấp câu hỏi để truy vấn dữ liệu.';
        }

        const result = await sqlDatabaseService.queryDatabase(question);

        // Format response
        let response = '';

        // Add answer
        if (result.answer) {
          response += `📊 **Kết quả:**\n${result.answer}\n\n`;
        }

        return (
          response.trim() || '✅ Truy vấn thành công nhưng không có dữ liệu.'
        );
      } catch (error) {
        console.error('❌ SQL Tool error:', error);
        return `❌ Lỗi trong SQL tool: ${error.message}`;
      }
    },
    {
      name: 'sql_query',
      description: `
        Bạn là trợ lý AI quản lý nhân sự. Dựa trên câu hỏi người dùng, tạo truy vấn SQL chính xác. Chỉ trả về truy vấn SQL thuần túy, không bao gồm định dạng markdown (như \`\`\`sql hoặc \`\`\`).
        Các bảng: employees (id, user_id, date_of_birth, address, phone, department, position, contract_type, contract_start, contract_end), users (id, full_name, email).
        Ví dụ: "Tìm nhân viên có tên Nhu Hong" → SELECT "id", "user_id", "date_of_birth", "address", "phone", "department", "position", "contract_type", "contract_start", "contract_end" FROM "public"."employees" WHERE "user_id" = (SELECT "id" FROM "public"."users" WHERE "full_name" = 'Nhu Hong') LIMIT 5;
        
        
        Sử dụng tool này khi người dùng:
        - Hỏi về số liệu, thống kê
        - Cần tìm kiếm thông tin nhân viên
        - Muốn xem dữ liệu trong database
        - Đặt câu hỏi phân tích dữ liệu
        - Muốn thực hiện thay đổi dữ liệu trong database
        
        Ví dụ:
        - "Có bao nhiêu nhân viên trong công ty?"
        - "Liệt kê nhân viên phòng IT"
        - "Thống kê nhân viên theo phòng ban"
        - "Tìm thông tin nhân viên tên John"
      `,
      schema: z.object({
        question: z
          .string()
          .describe('Câu hỏi hoặc yêu cầu truy vấn dữ liệu từ database'),
      }),
    },
  );
}
