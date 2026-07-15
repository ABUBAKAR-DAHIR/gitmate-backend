import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';
import cookieParser from 'cookie-parser';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix("api")

  app.use(cookieParser());
  app.enableCors({
    origin: process.env.FRONTEND_URL,
    credentials: true
  })

  const config = new DocumentBuilder()
    .setTitle("Gitmate API")
    .setDescription("API Documentation for Gitmacoote project")
    .setVersion("1.0")
    .build()

  const document = SwaggerModule.createDocument(app, config)

  SwaggerModule.setup("api/api-docs", app, document)

  const port = process.env.PORT ?? 5000;
  await app.listen(port, '0.0.0.0');
}
bootstrap();
