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

//     async validateOrCreateUser(profile: any) {
//         const email = profile.emails?.[0]?.value;
//         const provider = profile.provider;
//         const providerId = profile.id;

//         if (!email) {
//         throw new Error('No email found from Google');
//         }

//         // 1️⃣ Check if user exists by providerId
//         let user = await this.prisma.user.findUnique({
//         where: { providerId }
//         });

//         if (user) return user;

//         // 2️⃣ Check if user exists by email (account linking)
//         user = await this.prisma.user.findUnique({
//         where: { email }
//         });

//         if (user) {
//         return await this.prisma.user.update({
//             where: { email },
//             data: {
//             provider,
//             providerId
//             }
//         });
//         }

//         // 3️⃣ Create new user
//         return await this.prisma.user.create({
//         data: {
//             email,
//             name: profile.displayName || 'No Name',
//             image: profile.photos?.[0]?.value,
//             provider,
//             providerId
//         }
//         });
//   }

    async validateOrCreateUser(profile: any) {
        const provider = profile.provider;
        const providerId = profile.id;

        const email = profile.emails?.[0]?.value || null;
        const name =
            profile.displayName ||
            profile.username ||
            'No Name';

        const image = profile.photos?.[0]?.value || null;

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
                name,
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
