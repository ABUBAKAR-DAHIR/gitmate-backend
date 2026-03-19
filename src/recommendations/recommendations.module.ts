import { Module } from '@nestjs/common';
import { RecommendationsService } from './recommendations.service';
import { RecommendationsController } from './recommendations.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  providers: [RecommendationsService],
  controllers: [RecommendationsController],
  imports: [PrismaModule, AuthModule]
})
export class RecommendationsModule {}
