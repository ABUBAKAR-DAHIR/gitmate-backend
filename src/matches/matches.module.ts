import { Module } from '@nestjs/common';
import { MatchesService } from './matches.service';
import { MatchesController } from './matches.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';

@Module({
  providers: [MatchesService, PrismaService, JwtService, UserService],
  controllers: [MatchesController]
})
export class MatchesModule {}
