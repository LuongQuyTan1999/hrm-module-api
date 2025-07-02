import { Migration } from '@mikro-orm/migrations';

export class Migration20250702022726_AddAttendanceTable extends Migration {

  override async up(): Promise<void> {
    this.addSql(`select 1`);
  }

  override async down(): Promise<void> {
    this.addSql(`select 1`);
  }

}
