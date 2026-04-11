import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ProfileService {
    constructor(private readonly prisma: PrismaService){}

    async createOrUpdateProfile(userId: string, profile: any){
        const newProfile = await this.prisma.profile.upsert({
            where: {userId: userId},
            update: profile,
            create: {
                ...profile,
                userId
            }
        })

        return newProfile;
    }

    async getProfile(user: User){
        const found = await this.prisma.profile.findUnique({
            where: {userId: user.id}
        })

        if(!found) return {success: false, message: "Profile not found"}
        return {success: true, message: "Profile  found", data: found}
    }
}
