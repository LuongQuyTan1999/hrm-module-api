import { Migration } from '@mikro-orm/migrations';

export class Migration20250705063302_CreateLeaveBalanceTriggers extends Migration {
  override async up(): Promise<void> {
    this.addSql(/*sql*/ `
      CREATE OR REPLACE FUNCTION handle_leave_balance_updates()
      RETURNS TRIGGER AS $$
      DECLARE
        days_requested INTEGER;
        current_balance DECIMAL(5,2);
      BEGIN
        -- Calculate the number of days requested
        days_requested := (NEW.end_date - NEW.start_date) + 1;

        IF NEW.status = 'approved' AND (OLD.status IS NULL OR OLD.status != 'approved') THEN
          SELECT balance_days INTO current_balance
          FROM leave_balances
          WHERE employee_id = NEW.employee_id AND leave_type = NEW.leave_type;

          IF current_balance IS NULL THEN
            RAISE EXCEPTION 'Leave balance not found for employee % and leave type %',
              NEW.employee_id, NEW.leave_type;
          END IF;

          IF current_balance < days_requested THEN
            RAISE EXCEPTION 'Insufficient leave balance for employee %: requested % days, available % days',
              NEW.employee_id, days_requested, current_balance;
          END IF;

          -- Deduct from balance
          UPDATE leave_balances
          SET balance_days = balance_days - days_requested,
              updated_at = CURRENT_TIMESTAMP
          WHERE employee_id = NEW.employee_id AND leave_type = NEW.leave_type;
        END IF;

        IF OLD.status = 'approved' AND NEW.status != 'approved' THEN
          -- Restore balance if leave was approved and is now being cancelled or rejected
          UPDATE leave_balances
          SET balance_days = balance_days + days_requested,
              updated_at = CURRENT_TIMESTAMP
          WHERE employee_id = OLD.employee_id AND leave_type = OLD.leave_type;
        END IF;

        RETURN NEW;
      END;
      $$ LANGUAGE plpgsql;
    `);

    this.addSql(/*sql*/ `
      CREATE TRIGGER attendance_after_update_v2
      AFTER UPDATE ON leave_requests
      FOR EACH ROW 
      EXECUTE FUNCTION handle_leave_balance_updates();
    `);
  }

  override async down(): Promise<void> {
    this.addSql(/*sql*/ `
      DROP TRIGGER IF EXISTS attendance_after_update_v2 ON leave_requests;
    `);
    this.addSql(/*sql*/ `
      DROP FUNCTION IF EXISTS handle_leave_balance_updates();
    `);
  }
}
