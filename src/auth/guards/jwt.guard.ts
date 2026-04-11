import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";

@Injectable()
export class JwtAuthGuard implements CanActivate{
    
    constructor(private readonly jwtService: JwtService){}

    canActivate(context: ExecutionContext): boolean{
        const request = context.switchToHttp().getRequest()

        const token = request.cookies?.access_token;

        if(!token) {
        throw new UnauthorizedException("No token found!")
        }

        try {
            const payload = this.jwtService.verify(token);
            request.user = payload
            return true
        } catch (error:any) {
            console.error("Backend Jwt Error: ", error.message)
            throw new UnauthorizedException("Invalid or expired token");            
        }
    }
}