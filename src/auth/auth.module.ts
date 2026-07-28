import { Module } from '@nestjs/common'
import { PassportModule } from '@nestjs/passport'
import { AuthController } from './auth.controller'
import { AuthService } from './auth.service'
import { GoogleStrategy } from './strategies/google.strategy'
import { GithubStrategy } from './strategies/github.strategy'
import { JwtModule } from '@nestjs/jwt'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { JwtAuthGuard } from './guards/jwt.guard'
import { PrismaModule } from 'src/prisma/prisma.module'
import { UserService } from 'src/user/user.service'

@Module({
  imports: [
    JwtModule.registerAsync({
        imports: [ConfigModule],
        inject: [ConfigService],

        useFactory: (config: ConfigService) => ({
            secret: process.env.JWT_SECRET,
            signOptions: { expiresIn: '24h' },
        })
    }),
    
    PassportModule,
    PrismaModule
  ],
  controllers: [AuthController],
  providers: [AuthService, GoogleStrategy, GithubStrategy, JwtAuthGuard, UserService],
  exports: [JwtModule, JwtAuthGuard]
})
export class AuthModule {}
