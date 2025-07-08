import { MikroORM } from '@mikro-orm/core';
import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import * as dotenv from 'dotenv';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from './common/filter/all-exception.filter';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  dotenv.config();

  const app = await NestFactory.create(AppModule);

  const { httpAdapter } = app.get(HttpAdapterHost);
  app.useGlobalFilters(new AllExceptionsFilter(httpAdapter));
  app.useGlobalPipes(new ValidationPipe({ transform: true }));

  // In prod we only allow the front-end origins specified in CORS_ORIGINS
  app.enableCors({
    origin:
      process.env.NODE_ENV === 'production'
        ? (process.env.CORS_ORIGINS ?? '').split(',') // e.g. https://app.example.com
        : true,
    credentials: true,
  });

  // Get the ORM instance
  const orm = app.get(MikroORM);

  // Fork the entity manager to ensure we work with a clean one
  const migrator = orm.getMigrator();

  // Run migrations if not in production
  if (process.env.NODE_ENV !== 'production') {
    await migrator.up();
  }

  await app.listen(process.env.PORT || 3000);
  console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();
