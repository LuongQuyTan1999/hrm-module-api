// src/modules/ai/tools/search-employees.tool.ts
import { tool } from '@langchain/core/tools';
import { CreateEmployeeDto } from 'src/modules/employees/dto/create-employee.dto';
import { EmployeesService } from '../../employees/employees.service';
import { ERROR_MESSAGES } from '../constants/prompts';
import {
  SearchEmployeesInput,
  searchEmployeesSchema,
  UpdateEmployeeInput,
  updateEmployeeSchema,
} from '../schemas/employees.schema';

export function createSearchEmployeesTool(employeesService: EmployeesService) {
  return tool(
    async ({ query, department, role, limit }: SearchEmployeesInput) => {
      try {
        const result = await employeesService.findAll({
          search: query,
          department,
          role,
          limit: limit || 10,
          page: 1,
        });

        if (result.items.length === 0) {
          return ERROR_MESSAGES.NO_EMPLOYEE_FOUND;
        }

        const employeeList = result.items
          .map(
            (emp) =>
              `• ${emp.department || 'N/A'} (ID: ${emp.id})\n  Email: ${emp.department || 'N/A'}\n  Phòng ban: ${emp.department || 'N/A'}\n  Vị trí: ${emp.position || 'N/A'}\n  Vai trò: ${emp.department || 'N/A'}`,
          )
          .join('\n\n');

        return `Tìm thấy ${result.items.length} nhân viên:\n\n${employeeList}`;
      } catch (error) {
        console.error('Search employees error:', error);
        return `Lỗi khi tìm kiếm nhân viên: ${error.message}`;
      }
    },
    {
      name: 'search_employees',
      description:
        'Tìm kiếm nhân viên theo tên, email, phòng ban, hoặc vai trò (ví dụ: employee, manager)',
      schema: searchEmployeesSchema,
    },
  );
}

export function createUpdateEmployeeTool(employeesService: EmployeesService) {
  return tool(
    async (args: UpdateEmployeeInput) => {
      try {
        const employee = await employeesService.findAll({
          search: args.query,
          limit: 10,
          page: 1,
        });

        const employeeData = {
          ...args,
        };

        const newEmployee = await employeesService.update(
          employee.items?.[0].id,
          employeeData as CreateEmployeeDto,
        );
        return `Đã cập nhật hồ sơ nhân viên mới:  (ID: ${newEmployee.id})`;
      } catch (error) {
        console.error('❌ Lỗi khi cập nhật nhân viên:', error);
        return `❌ ${ERROR_MESSAGES.UPDATE_FAILED}: ${error.message}`;
      }
    },
    {
      name: 'update_employee',
      description:
        'Cập nhật thông tin nhân viên bằng cách tìm kiếm theo tên (và email nếu cần thiết)',
      schema: updateEmployeeSchema,
    },
  );
}
