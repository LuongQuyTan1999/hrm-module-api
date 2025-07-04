import { Migration } from '@mikro-orm/migrations';

export class Migration20250704081133_UpdateLeaveBalancesForAllEmployees extends Migration {
  override async up(): Promise<void> {
    this.addSql(/*sql*/ `
      UPDATE leave_balances
      SET balance_days = 0
      WHERE employee_id IN (
        SELECT id FROM employees
      );
      
      INSERT INTO leave_balances (employee_id, leave_type, balance_days, year)
      SELECT id, 'annual', 12 , EXTRACT(YEAR FROM CURRENT_DATE)
      FROM employees e
      WHERE NOT EXISTS (
        SELECT 1 FROM leave_balances lb 
        WHERE lb.employee_id = e.id AND lb.leave_type = 'annual'
      );
      
      INSERT INTO leave_balances (employee_id, leave_type, balance_days, year)
      SELECT id, 'sick', 3 , EXTRACT(YEAR FROM CURRENT_DATE)
      FROM employees e
      WHERE NOT EXISTS (
        SELECT 1 FROM leave_balances lb 
        WHERE lb.employee_id = e.id AND lb.leave_type = 'sick'
      );
      
      INSERT INTO leave_balances (employee_id, leave_type, balance_days, year)
      SELECT id, 'casual', 3 , EXTRACT(YEAR FROM CURRENT_DATE)
      FROM employees e
      WHERE NOT EXISTS (
        SELECT 1 FROM leave_balances lb 
        WHERE lb.employee_id = e.id AND lb.leave_type = 'casual'
      );

      INSERT INTO leave_balances (employee_id, leave_type, balance_days, year)
      SELECT id, 'remote', 10, EXTRACT(YEAR FROM CURRENT_DATE)
      FROM employees e
      WHERE NOT EXISTS (
        SELECT 1 FROM leave_balances lb 
        WHERE lb.employee_id = e.id AND lb.leave_type = 'remote'
      );
    `);
  }

  override async down(): Promise<void> {
    this.addSql(/*sql*/ `
      DELETE FROM leave_balances
      WHERE employee_id IN (
        SELECT id FROM employees
      ) AND leave_type IN ('annual', 'sick', 'casual');
    `);
  }
}
