// import { Module } from '@nestjs/common';
// import { AuthService } from './auth.service';
// import { AuthController } from './auth.controller';
// import { GoogleStrategy } from './strategies/google.strategy';
// import { PassportModule } from '@nestjs/passport';

// @Module({
//   providers: [PassportModule],
//   controllers: [AuthController],
//   providers: [AuthService, GoogleStrategy],
// })
// export class AuthModule {}

import { Module } from '@nestjs/common'
import { PassportModule } from '@nestjs/passport'
import { AuthController } from './auth.controller'
import { AuthService } from './auth.service'
import { GoogleStrategy } from './strategies/google.strategy'
import { GithubStrategy } from './strategies/github.strategy'
import { JwtModule } from '@nestjs/jwt'
import { ConfigService } from '@nestjs/config'
import { JwtAuthGuard } from './guards/jwt.guard'
import { PrismaModule } from 'src/prisma/prisma.module'

@Module({
  imports: [
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        // const secret = config.get<string>("JWT_SECRET")
        const secret = process.env.JWT_SECRET

        if(!secret){
          throw new Error("JWT SECRET not found!")
        }

        return {
          secret,
          signOptions: {expiresIn: '24h'}
        }
      }

    }),
    
    PassportModule,
    PrismaModule
  ],
  controllers: [AuthController],
  providers: [AuthService, GoogleStrategy, GithubStrategy, JwtAuthGuard],
  exports: [JwtModule, JwtAuthGuard]
})
export class AuthModule {}
