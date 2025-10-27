import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { LoggerService } from './logger/logger.service';
import { AllExceptionsFilter } from './exeptions/error-handling';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(process.env.PORT ?? 3000);

  const loggerService = app.get(LoggerService);
  const httpAdapterHost = app.get(HttpAdapterHost);

  app.useLogger(loggerService);
  app.useGlobalFilters(new AllExceptionsFilter (httpAdapterHost, loggerService))
}
bootstrap();
