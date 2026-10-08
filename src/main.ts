import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';
import { TransformInterceptor } from './common/intercrptors/transform.interceptor.js';
import { LoggerInterceptor } from './common/intercrptors/logger.interceptor.js';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {});
  app.useGlobalInterceptors(new TransformInterceptor());
  app.useGlobalInterceptors(new LoggerInterceptor());
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
    }),
  );
  app.enableShutdownHooks();
  await app.listen(Number(process.env.PORT) || 5000, () => {
    console.log(`Application is running on port ${process.env.PORT}`);
  });
}
await bootstrap();
