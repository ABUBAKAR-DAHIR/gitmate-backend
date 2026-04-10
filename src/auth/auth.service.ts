import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';

@Injectable()
export class AuthService {
    constructor(private readonly jwtService: JwtService){}

    generateToken(user: User){
        // console.log("jfnf ", process.env.JWT_SECRET);
        return this.jwtService.sign({
            id: user.id,
            email: user.email
        })
    }

    getMe(req: any){
        return {
            isLoggedIn: true,
            user: req.user
        }
    }
}
