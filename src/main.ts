import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as dotenv from 'dotenv';
dotenv.config();


async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable Swagger
  const config = new DocumentBuilder()
    .setTitle('AI Resume Evaluator API')
    .setDescription('API for uploading and evaluating resumes using AI')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document); // <- This enables Swagger at /api/docs

  // Enable CORS globally
  app.enableCors({
    origin: '*', // Allow all origins (or specify specific origins like 'http://localhost:3001')
    methods: 'GET,POST,PUT,DELETE', // Allowed methods
    allowedHeaders: 'Content-Type, Authorization', // Allowed headers
  });
  
  await app.listen(3000);
}
void bootstrap();
