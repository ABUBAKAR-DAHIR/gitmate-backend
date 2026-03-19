import { Injectable } from '@nestjs/common';
import OpenAI from 'openai';
import { PrismaService } from '../prisma/prisma.service';
import { mockEmbedding } from './utility';

@Injectable()
export class EmbeddingsService {
    openai = new OpenAI({apiKey: process.env.OPENAI_API_KEY});

    constructor(private readonly prisma: PrismaService){}

    async generateAndSave(userId: string){
        const user = await this.prisma.user.findUnique({
            where: {id: userId},
            include: {profile: true}
        })

        if(!user || !user.profile) return null;

        const text = `${user.profile.skills}. ${user.profile.bio || ''}. Goals: ${user.profile.goals} `;

        const vector = await this.openai.embeddings.create({
            model: 'text-embedding-3-small',
            input: text
        })

        // const vector = response.data[0].embedding;
        // const vector = mockEmbedding(text)

        // converting TS array into a postgres array literal
        // const vectorString = `ARRAY[${vector.join(',')}]::vector(1536)`;


        // Use raw SQL to upsert
       await this.prisma.$executeRaw`
        INSERT INTO "Embedding" ("userId","embedding","createdAt","updatedAt")
        VALUES (
            ${userId},
            ${vector}::vector,
            now(),
            now()
        )
        ON CONFLICT ("userId") DO UPDATE
        SET embedding = ${vector}::vector,
            "updatedAt" = now();
        `;

        return {
            userId: userId,
            embedding: vector
        }

    }
}
