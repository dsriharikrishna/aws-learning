import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors();
  app.setGlobalPrefix('api/nest');
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('NestJS Products API')
    .setDescription('Production-grade NestJS REST API with PostgreSQL/Prisma on AWS EC2')
    .setVersion('1.0')
    .addTag('products')
    .addTag('health')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/nest/docs', app, document);

  const port = process.env.PORT || 3002;
  await app.listen(port);
  console.log(`NestJS application running on http://localhost:${port}/api/nest`);
  console.log(`OpenAPI documentation available at http://localhost:${port}/api/nest/docs`);
}

bootstrap();

