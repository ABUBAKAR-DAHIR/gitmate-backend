import {
    Controller,
    Get,
    UseGuards,
    Req,
    Res,
  } from '@nestjs/common';
  
  import { GoogleAuthGuard } from './guards/google.guard';
  import { GithubAuthGuard } from './guards/github.guard';
  import { AuthService } from './auth.service';
  import { JwtAuthGuard } from './guards/jwt.guard';
  
  @Controller('auth')
  export class AuthController {
    constructor(
      private readonly authService: AuthService,
    ) {}
  
    /*
     * =========================
     * GOOGLE
     * =========================
     */
  
    @Get('google')
    @UseGuards(GoogleAuthGuard)
    async googleLogin() {}
  
    @Get('google/callback')
    @UseGuards(GoogleAuthGuard)
    async googleRedirect(
      @Req() req: any,
      @Res() res: any,
    ) {
      const user =
        await this.authService.validateOrCreateUser(
          req.user,
        );
  
      const token =
        this.authService.generateToken(user);
  
      res.cookie('access_token', token, {
        httpOnly: true,
        secure: false,
        sameSite: 'lax',
        path: '/',
      });
  
      return res.redirect(
        process.env.FRONTEND_URL,
      );
    }
  
    /*
     * =========================
     * GITHUB
     * =========================
     */
  
    @Get('github')
    @UseGuards(GithubAuthGuard)
    async githubLogin() {}
  
    @Get('github/callback')
    @UseGuards(GithubAuthGuard)
    async githubRedirect(
      @Req() req: any,
      @Res() res: any,
    ) {
      const user =
        await this.authService.validateOrCreateUser(
          req.user,
        );
  
      const token =
        this.authService.generateToken(user);
  
      res.cookie('access_token', token, {
        httpOnly: true,
        secure: false,
        sameSite: 'lax',
        path: '/',
      });
  
      return res.redirect(
        process.env.FRONTEND_URL,
      );
    }
  
    /*
     * =========================
     * CURRENT USER
     * =========================
     */
  
    @Get('me')
    @UseGuards(JwtAuthGuard)
    getCurrentUser(@Req() req: any) {
      return {
        isLoggedIn: true,
        user: req.user,
      };
    }
  
    /*
     * =========================
     * LOGOUT
     * =========================
     */
  
    @Get('logout')
    logout(@Res() res: any) {
      res.clearCookie('access_token', {
        httpOnly: true,
        secure: false,
        sameSite: 'lax',
        path: '/',
      });
  
      return res.status(200).json({
        success: true,
        message: 'logged out successfully',
      });
    }
  }