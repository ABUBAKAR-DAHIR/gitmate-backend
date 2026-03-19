import { Module } from '@nestjs/common';
import { EmbeddingsService } from './embeddings.service';
import { EmbeddingsController } from './embeddings.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  providers: [EmbeddingsService],
  controllers: [EmbeddingsController],
  imports: [PrismaModule]
})
export class EmbeddingsModule {}
