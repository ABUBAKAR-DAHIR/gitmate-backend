import { Module } from '@nestjs/common';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { AuthModule } from './auth/auth.module.js';
import { ConfigModule } from '@nestjs/config';
import { EmbeddingsModule } from './embeddings/embeddings.module.js';
import { PrismaModule } from './prisma/prisma.module.js';
import { RecommendationsModule } from './recommendations/recommendations.module.js';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true
    }),
    AuthModule,
    EmbeddingsModule,
    PrismaModule,
    RecommendationsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
