import { Module } from '@nestjs/common';
import { ProfileController } from './profile.controller';
import { ProfileService } from './profile.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { JwtModule } from '@nestjs/jwt';
import { EmbeddingsModule } from 'src/embeddings/embeddings.module';

@Module({
  controllers: [ProfileController],
  providers: [ProfileService],
  imports: [
    PrismaModule,
    JwtModule,
    EmbeddingsModule
  ]
})
export class ProfileModule {}
