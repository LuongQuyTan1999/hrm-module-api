import { Migration } from '@mikro-orm/migrations';

export class Migration20250720063129_UpdateAttendanceAfterUpdateTriggers extends Migration {
  override async up(): Promise<void> {
    this.addSql(/*sql*/ `
      CREATE OR REPLACE FUNCTION validate_attendance(attendance_id UUID)
      RETURNS VARCHAR AS $$
      DECLARE
        v_check_in TIMESTAMP;
        v_check_out TIMESTAMP;
        v_shift_id UUID;
        v_start_time TIME;
        v_end_time TIME;
        v_status VARCHAR;
      BEGIN
        SELECT check_in, check_out, shift_id
        INTO v_check_in, v_check_out, v_shift_id
        FROM attendance a
        WHERE a.id = attendance_id;

        SELECT start_time, end_time
        INTO v_start_time, v_end_time
        FROM shift_configurations s
        WHERE s.id = v_shift_id;

        v_status := 'normal';

        IF EXTRACT(HOUR FROM v_check_in) > EXTRACT(HOUR FROM v_start_time) OR
          (EXTRACT(HOUR FROM v_check_in) = EXTRACT(HOUR FROM v_start_time) AND
          EXTRACT(MINUTE FROM v_check_in) > EXTRACT(MINUTE FROM v_start_time)) THEN
          v_status := 'late';
        END IF;

        IF v_check_out IS NOT NULL AND(
          EXTRACT(HOUR FROM v_check_out) < EXTRACT(HOUR FROM v_end_time) OR 
          (EXTRACT(HOUR FROM v_check_out) = EXTRACT(HOUR FROM v_end_time) AND
          EXTRACT(MINUTE FROM v_check_out) < EXTRACT(MINUTE FROM v_end_time))) THEN
          v_status := CASE v_status WHEN 'late' THEN 'late_early' ELSE 'early' END;
        END IF;

        UPDATE attendance
        SET status = v_status
        WHERE id = attendance_id;

        return v_status;
      END;
      $$ LANGUAGE plpgsql;
    `);

    this.addSql(/*sql*/ `
      CREATE OR REPLACE FUNCTION attendance_update_trigger()
      RETURNS TRIGGER AS $$
      BEGIN
        PERFORM validate_attendance(NEW.id);

        RETURN NEW;
      END;
      $$ LANGUAGE plpgsql;
    `);

    this.addSql(/*sql*/ `
      CREATE TRIGGER attendance_after_update
      AFTER INSERT OR UPDATE OF check_in, check_out, shift_id 
      ON attendance
      FOR EACH ROW
      EXECUTE FUNCTION attendance_update_trigger();
    `);
  }

  override async down(): Promise<void> {
    this.addSql(/*sql*/ `
      DROP TRIGGER IF EXISTS attendance_after_update ON attendance;
    `);

    this.addSql(/*sql*/ `
      DROP FUNCTION IF EXISTS attendance_update_trigger();
    `);

    this.addSql(/*sql*/ `
      DROP FUNCTION IF EXISTS validate_attendance(UUID);
    `);
  }
}
