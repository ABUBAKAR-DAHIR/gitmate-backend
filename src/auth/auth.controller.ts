import { Controller, Get, UseGuards, Req, Res } from '@nestjs/common'
import { GoogleAuthGuard } from './guards/google.guard'
import { GithubAuthGuard } from './guards/github.guard'
import { AuthService } from './auth.service'
import { JwtAuthGuard } from './guards/jwt.guard'
// import { GoogleAuthGuard } from './guards/google-auth.guard'

@Controller('auth')
export class AuthController {

  constructor(private readonly authService: AuthService){}

  @Get('google')
  @UseGuards(GoogleAuthGuard)
  async googleLogin() {}

  @Get('google/callback')
  @UseGuards(GoogleAuthGuard)
  googleRedirect(@Req() req, @Res() res:any) {
    // const user = req.user

    // const token = this.authService.generateToken(user);

    // res.cookie('access_token', token, {
    //   httpOnly: true,
    //   secure: false,
    //   sameSite: 'lax'
    // })

    // return res.redirect("http://localhost:8081")

    return res.json(req.user)
  }

  @Get("github")
  @UseGuards(GithubAuthGuard)
  async GithubLogin(){}

  @Get("github/callback")
  @UseGuards(GithubAuthGuard)
  async GithubRedirect(@Req() req: any, @Res() res: any){
    const user = req.user

    // const token = this.authService.generateToken(user);

    // res.cookie('access_token', token, {
    //   httpOnly: true,
    //   secure: false,
    //   sameSite: 'lax'
    // })

    // return res.redirect("http://localhost:8081")
    return res.json(user)
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  getCurrentUser(@Req() req: any){
    return {
      isLoggedIn: true,
      user: req.user
    }
  }

}