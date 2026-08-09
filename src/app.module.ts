import { Module } from '@nestjs/common';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { AuthModule } from './auth/auth.module.js';
import { ConfigModule } from '@nestjs/config';
import { EmbeddingsModule } from './embeddings/embeddings.module.js';
import { PrismaModule } from './prisma/prisma.module.js';
import { RecommendationsModule } from './recommendations/recommendations.module.js';
import { ProfileModule } from './profile/profile.module';
import { MatchesModule } from './matches/matches.module';
import { ProjectsModule } from './projects/projects.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true
    }),
    
    AuthModule,
    EmbeddingsModule,
    PrismaModule,
    RecommendationsModule,
    ProfileModule,
    MatchesModule,
    ProjectsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
