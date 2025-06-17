import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import databaseConfig from './common/db/database.config';
import { JwtAuthGuard } from './common/guards/jwt-auth.guard';
import { RolesGuard } from './common/guards/roles.guard';
import { AuthModule } from './modules/auth/auth.module';
import { EmployeesModule } from './modules/employees/employees.module';
import { AiModule } from './modules/ai/ai.module';

@Module({
  imports: [
    MikroOrmModule.forRoot(databaseConfig),
    AuthModule,
    EmployeesModule,
    AiModule,
  ],
  providers: [
    { provide: 'APP_GUARD', useClass: JwtAuthGuard },
    { provide: 'APP_GUARD', useClass: RolesGuard },
  ],
})
export class AppModule {}
