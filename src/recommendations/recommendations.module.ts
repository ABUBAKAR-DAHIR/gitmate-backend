import { Module } from '@nestjs/common';
import { RecommendationsService } from './recommendations.service';
import { RecommendationsController } from './recommendations.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { AuthModule } from 'src/auth/auth.module';
import { UserService } from 'src/user/user.service';

@Module({
  providers: [RecommendationsService, UserService],
  controllers: [RecommendationsController],
  imports: [PrismaModule, AuthModule]
})
export class RecommendationsModule {}
