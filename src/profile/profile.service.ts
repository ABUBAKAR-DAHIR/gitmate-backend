import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { connect } from 'http2';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ProfileService {
    constructor(private readonly prisma: PrismaService){}

    async createOrUpdateProfile(userId: string, profile: any){
        const user = await this.prisma.user.findUnique({
            where: { id: userId }
        });

        if (!user) {
            throw new Error("User not found");
        }
        
        const newProfile = await this.prisma.profile.upsert({
            where: {userId: userId},
            update: profile,
            create: {
                ...profile,
                user: {
                    connect: {
                        id: userId
                    }
                }
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
