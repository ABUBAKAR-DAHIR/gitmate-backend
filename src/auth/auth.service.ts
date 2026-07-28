import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AuthService {
    constructor(
        private readonly jwtService: JwtService,
        private readonly prisma: PrismaService
    ){}

    generateToken(user: User){
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

    async validateOrCreateUser(profile: any) {
        const provider = profile.provider;
        const providerId = profile.providerId;

        const email = profile.email || null;
        const name =
            profile.displayName ||
            profile.username ||
            null;
        const displayName = name.split(/\s+/)[0];
        const image = profile.picture || null;

        // 1️⃣ Check if account already exists
        const existingAccount = await this.prisma.account.findUnique({
            where: {
            provider_providerId: {
                provider,
                providerId,
            },
            },
            include: {
            user: true,
            },
        });

        if (existingAccount) {
            return existingAccount.user;
        }

        // 2️⃣ Check if user exists by email
        let user;

        if (email) {
            user = await this.prisma.user.findUnique({
            where: { email },
            });
        }

        // 3️⃣ Create user if not exists
        if (!user) {
            user = await this.prisma.user.create({
            data: {
                email,
                name: displayName,
                image,
            },
            });
        }

        // 4️⃣ Link account
        await this.prisma.account.create({
            data: {
            provider,
            providerId,
            userId: user.id,
            },
        });

        return user;
        }
}
