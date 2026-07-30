import {
    Injectable,
    NotFoundException,
  } from '@nestjs/common';
  
  import { PrismaService } from '../prisma/prisma.service';
  
  type RecommendedProfile = {
    userId: string;
    email: string;
    name: string;
    image: string | null;
  
    skills: string;
    bio: string | null;
    goals: string;
    experience: string;
    availability: string;
    timezone: string;
  
    similarity: number;
  };
  
  @Injectable()
  export class RecommendationsService {
    constructor(
      private readonly prisma: PrismaService,
    ) {}
  
    async getTopMatches(
      userId: string,
      limit = 10,
    ): Promise<RecommendedProfile[]> {
      // Check that the current user has an embedding.
      const currentEmbedding =
        await this.prisma.$queryRaw<
          { embedding: string }[]
        >`
          SELECT embedding::text
          FROM "Embedding"
          WHERE "userId" = ${userId}
          LIMIT 1;
        `;
  
      if (!currentEmbedding.length) {
        throw new NotFoundException(
          'Embedding not found for user',
        );
      }
  
      const embedding =
        currentEmbedding[0].embedding;
  
      // Find similar users while excluding:
      // 1. The current user
      // 2. Anyone already matched with the current user
      const recommendations =
        await this.prisma.$queryRaw<
          RecommendedProfile[]
        >`
          SELECT
            e."userId",
            u.email,
            u.name,
            u.image,
  
            p.skills,
            p.bio,
            p.goals,
            p.experience,
            p.availability,
            p.timezone,
  
            1 - (
              e.embedding <=> ${embedding}::vector
            ) AS similarity
  
          FROM "Embedding" e
  
          INNER JOIN "User" u
            ON u.id = e."userId"
  
          INNER JOIN "Profile" p
            ON p."userId" = u.id
  
          WHERE
            e."userId" != ${userId}
  
            AND NOT EXISTS (
              SELECT 1
              FROM "Match" m
              WHERE
                (
                  m."userAId" = ${userId}
                  AND m."userBId" = e."userId"
                )
                OR
                (
                  m."userBId" = ${userId}
                  AND m."userAId" = e."userId"
                )
            )
  
          ORDER BY
            e.embedding <=> ${embedding}::vector
  
          LIMIT ${Math.max(
            1,
            Math.min(limit, 50),
          )};
        `;
  
      return recommendations;
    }
  }