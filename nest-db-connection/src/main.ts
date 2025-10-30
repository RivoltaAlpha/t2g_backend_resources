import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { LoggerService } from './logger/logger.service';
import { AllExceptionsFilter } from './exeptions/error-handling';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  const loggerService = app.get(LoggerService);
  const httpAdapterHost = app.get(HttpAdapterHost);
  
  app.useLogger(loggerService);
  app.useGlobalFilters(new AllExceptionsFilter (httpAdapterHost, loggerService))
  
  // swagger documentation set up
  const config = new DocumentBuilder()
    .setTitle('Events API')
    .setDescription('This is an events management API documentation')
    .setVersion('1.0')
    .addServer('http://localhost:8000', 'Local server')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'Bearer',
        bearerFormat: 'JWT',
        name: 'Authorization',
        description: 'Enter your JWT Token',
        in: 'header',
      },
      'access-token',
    )
    .build();

    const documentFactory = () => SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api/docs', app, documentFactory, {
      jsonDocumentUrl: 'api/json',
      swaggerOptions: {
        persistAuthorization: true,
        tagsSorter: 'alpha',
        operationsSorter: 'alpha',
      },
    });

  await app.listen(process.env.PORT ?? 8000);
}
bootstrap();
