import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class RecommendationsService {
    constructor(private readonly prisma: PrismaService){}

    async getTopMatches(userId: string, limit: number = 5){
        // Fetch current user embedding
        const userEmbedding = await this.prisma.$queryRawUnsafe<{userId: string, similarity: number}[]>(`
            SELECT "userId", embedding <-> (SELECT embedding FROM "Embedding" WHERE "userId" = '${userId}') AS similarity
            FROM "Embedding"
            WHERE "userId" != '${userId}'
            ORDER BY similarity
            LIMIT ${limit}  
        `)

        const matchedIds = userEmbedding.map((e) => e.userId)
        
        const users = await this.prisma.user.findMany({
            where: {id: {in: matchedIds}},
            include: {profile: true}
        })

        const similarityGroup = new Map(userEmbedding.map(u => [u.userId, u.similarity]))
        users.sort((a, b) => (similarityGroup.get(a.id) ?? 0)- (similarityGroup.get(b.id) ?? 0))

        // users.sort((a, b) => userEmbedding.find(u => u.userId === a.id)?.similarity - userEmbedding.find(u => u.userId === b.id)?.similarity)
        
        return users;

        
    }
}
