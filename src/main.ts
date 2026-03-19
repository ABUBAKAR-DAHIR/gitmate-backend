import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';
import cookieParser from 'cookie-parser';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // app.setGlobalPrefix("api")
  app.use(cookieParser());
  app.enableCors({
    origin: "http://localhost:8081",
    credentials: true
  })

  const config = new DocumentBuilder()
    .setTitle("Gitmate API")
    .setDescription("API Documentation for Gitmate project")
    .setVersion("1.0")
    .build()

  const document = SwaggerModule.createDocument(app, config)

  SwaggerModule.setup("api-docs", app, document)

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
