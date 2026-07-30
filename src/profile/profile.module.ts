import { Module } from '@nestjs/common';
import { ProfileController } from './profile.controller';
import { ProfileService } from './profile.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { JwtModule } from '@nestjs/jwt';
import { EmbeddingsModule } from 'src/embeddings/embeddings.module';
import { UserService } from 'src/user/user.service';
import { RecommendationsService } from 'src/recommendations/recommendations.service';

@Module({
  controllers: [ProfileController],
  providers: [ProfileService, UserService, RecommendationsService],
  imports: [
    PrismaModule,
    JwtModule,
    EmbeddingsModule
  ]
})
export class ProfileModule {}
