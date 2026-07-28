import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { UserService } from "src/user/user.service";

@Injectable()
export class JwtAuthGuard implements CanActivate{
    
    constructor(
        private readonly jwtService: JwtService,
        private readonly userService: UserService
    ){}

    async canActivate(context: ExecutionContext): Promise<boolean>{
        const request = context.switchToHttp().getRequest()

        const token = request.cookies?.access_token;

        if(!token) {
        throw new UnauthorizedException("No token found!")
        }

        try {
            const payload = this.jwtService.verify(token, {
                secret: process.env.JWT_SECRET
            });

            const user = await this.userService.findUserById(payload.id);

            request.user = user
            console.log("user: ", user)
            return true
        } catch (error:any) {
            console.error("Backend Jwt Error: ", error.message)
            throw new UnauthorizedException("Invalid or expired token");            
        }
    }
}