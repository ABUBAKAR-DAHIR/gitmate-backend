import { Module } from '@nestjs/common';
import { EmbeddingsService } from './embeddings.service';
import { EmbeddingsController } from './embeddings.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  providers: [EmbeddingsService],
  controllers: [EmbeddingsController],
  imports: [PrismaModule, ConfigModule],
  exports: [EmbeddingsService]
})
export class EmbeddingsModule {}
