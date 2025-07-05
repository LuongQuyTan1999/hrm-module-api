import { Migration } from '@mikro-orm/migrations';

export class Migration20250705070610_CreateValidateLeaveRequestBalance extends Migration {
  override async up(): Promise<void> {
    this.addSql(/*sql*/ `
      CREATE OR REPLACE FUNCTION validate_leave_request_balance()
      RETURNS TRIGGER AS $$
      DECLARE
        days_requested INTEGER;
        current_balance DECIMAL(5,2);
      BEGIN
        IF TG_OP = 'INSERT' OR TG_OP = 'UPDATE' THEN
          -- Calculate the number of days requested
          days_requested := (NEW.end_date - NEW.start_date) + 1;

          -- Check if the leave type and employee exist
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
        END IF;

        RETURN NEW;
      END;
      $$ LANGUAGE plpgsql;
    `);

    this.addSql(/*sql*/ `
      CREATE TRIGGER validate_leave_request_balance_trigger_v2
      BEFORE INSERT OR UPDATE ON leave_requests
      FOR EACH ROW
      EXECUTE FUNCTION validate_leave_request_balance();
    `);

    this.addSql(/*sql*/ `
      CREATE OR REPLACE FUNCTION check_leave_overlap()
      RETURNS TRIGGER AS $$
      DECLARE
        overlap_count INTEGER;
      BEGIN
        IF NEW.status IN ('approved', 'pending') THEN
          SELECT COUNT(*) INTO overlap_count
          FROM leave_requests lr
          WHERE lr.employee_id = NEW.employee_id
          AND lr.id  != COALESCE(NEW.id, '00000000-0000-0000-0000-000000000000')
          AND lr.status IN ('approved', 'pending')
          AND (
            (NEW.start_date BETWEEN lr.start_date AND lr.end_date)
            OR (NEW.end_date BETWEEN lr.start_date AND lr.end_date)
            OR (lr.start_date BETWEEN NEW.start_date AND NEW.end_date)
            OR (lr.end_date BETWEEN NEW.start_date AND NEW.end_date)
          );

          IF overlap_count > 0 THEN
            RAISE EXCEPTION 'Leave request overlaps with existing approved or pending leave for employee %',
              NEW.employee_id;
          END IF;
        END IF;

        RETURN NEW;
      END;
      $$ LANGUAGE plpgsql;
    `);

    this.addSql(/*sql*/ `
      CREATE TRIGGER check_leave_overlap_trigger_v2
      BEFORE INSERT OR UPDATE ON leave_requests
      FOR EACH ROW
      EXECUTE FUNCTION check_leave_overlap();
    `);
  }

  override async down(): Promise<void> {
    this.addSql(/*sql*/ `
      DROP TRIGGER IF EXISTS validate_leave_request_balance_trigger_v2 ON leave_requests;
    `);

    this.addSql(/*sql*/ `
      DROP TRIGGER IF EXISTS check_leave_overlap_trigger_v2 ON leave_requests;
    `);

    this.addSql(/*sql*/ `
      DROP FUNCTION IF EXISTS validate_leave_request_balance();
    `);

    this.addSql(/*sql*/ `
      DROP FUNCTION IF EXISTS check_leave_overlap();
    `);
  }
}
