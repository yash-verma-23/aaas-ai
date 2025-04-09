import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { configService } from './config/config.service';

export async function bootstrap() {
  const app = await NestFactory.create(AppModule, { rawBody: true });

  // API prefix
  app.setGlobalPrefix('api/v1');

  // Setup CORS
  app.enableCors({ origin: true });

  // Validation
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('API')
    .setDescription('API docs')
    .setVersion('1.0')
    .addBearerAuth();
  const document = SwaggerModule.createDocument(app, config.build());
  SwaggerModule.setup('api', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
      operationsSorter: 'method',
      tagsSorter: 'alpha',
    },
  });

  // Start
  const port = configService.getValue('PORT');
  await app.listen(port);
}
