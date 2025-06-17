// src/modules/ai/schemas/search-employees.schema.ts
import { z } from 'zod';

export const searchEmployeesSchema = z.object({
  query: z.string().optional().describe('Từ khóa tìm kiếm (tên hoặc email)'),
  department: z.string().optional().describe('Phòng ban'),
  role: z.string().optional().describe('Vai trò, ví dụ: employee, manager'),
  limit: z.number().optional().default(10).describe('Số lượng kết quả tối đa'),
});

export type SearchEmployeesInput = z.infer<typeof searchEmployeesSchema>;

export const updateEmployeeSchema = z.object({
  query: z.string().optional().describe('Từ khóa tìm kiếm (tên hoặc email)'),
  dateOfBirth: z.string().optional().describe('Ngày sinh'),
  address: z.string().optional().describe('Địa chỉ'),
  department: z.string().optional().describe('Phòng ban'),
  position: z.string().optional().describe('Vị trí công việc'),
  contractType: z
    .enum(['full_time', 'part_time', 'intern'])
    .optional()
    .describe('Loại hợp đồng'),
  contractStart: z.string().optional().describe('Ngày bắt đầu hợp đồng'),
  contractEnd: z.string().optional().describe('Ngày kết thúc hợp đồng'),
});

export type UpdateEmployeeInput = z.infer<typeof updateEmployeeSchema>;
