import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { EmbeddingsService } from 'src/embeddings/embeddings.service';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ProfileService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly embeddings: EmbeddingsService,
    ){}

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

        await this.embeddings.generateAndSave(user.id)

        return newProfile;
    }

    async getProfile(user: User){
        const found = await this.prisma.profile.findUnique({
            where: {userId: user.id}
        })  

        if(!found) return {success: false, message: "Profile not found"}
        return {success: true, message: "Profile  found", profile: found, user}
    }

    async getSimilarProfiles(user: User){
        const profiles = await this.embeddings.getSimilarProfiles(user.id)

        console.log(profiles)
        return profiles
    }
}
