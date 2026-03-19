import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
    constructor(private readonly jwtService: JwtService){}

    generateToken(user: any){
        // console.log("jfnf ", process.env.JWT_SECRET);
        return this.jwtService.sign({
            id: user.id,
            email: user.email
        })
    }
}
