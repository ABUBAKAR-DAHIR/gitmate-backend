import { Controller, Get, UseGuards, Req, Res } from '@nestjs/common'
import { GoogleAuthGuard } from './guards/google.guard'
import { GithubAuthGuard } from './guards/github.guard'
import { AuthService } from './auth.service'
import { JwtAuthGuard } from './guards/jwt.guard'
import path from 'path'
// import { GoogleAuthGuard } from './guards/google-auth.guard'

@Controller('auth')
export class AuthController {

  constructor(private readonly authService: AuthService){}

  @Get('google')
  @UseGuards(GoogleAuthGuard)
  async googleLogin() {}

  @Get('google/callback')
  @UseGuards(GoogleAuthGuard)
  async googleRedirect(@Req() req, @Res() res:any) {

    const user = await this.authService.validateOrCreateUser(req.user)

    const token = this.authService.generateToken(user);

    res.cookie('access_token', token, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      path: '/'
    })

    return res.redirect(process.env.FRONTEND_URL)

  }

  @Get("github")
  @UseGuards(GithubAuthGuard)
  async GithubLogin(){}

  @Get("github/callback")
  @UseGuards(GithubAuthGuard)
  async GithubRedirect(@Req() req: any, @Res() res: any){
    const user = await this.authService.validateOrCreateUser(req.user)

    const token = this.authService.generateToken(user);

    res.cookie('access_token', token, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      path: '/'
    })

    return res.redirect(process.env.FRONTEND_URL)
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  getCurrentUser(@Req() req: any){
    return {
      isLoggedIn: true,
      user: req.user
    }
  }

  @Get("logout")
  logout(@Res() res: any){
    res.clearCookie("access_token", {
      httpOnly: true,
      secure: false,
      sameSite: 'none',
      path: '/'
    })

    return res.redirect(process.env.FRONTEND_URL)
  }
  
}