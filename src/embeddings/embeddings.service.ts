// import { Injectable } from '@nestjs/common';
// import OpenAI from 'openai';
// import { PrismaService } from '../prisma/prisma.service';
// import { mockEmbedding } from './utility';

// @Injectable()
// export class EmbeddingsService {
//     openai = new OpenAI({apiKey: process.env.OPENAI_API_KEY});

//     constructor(private readonly prisma: PrismaService){}

//     async generateAndSave(userId: string){
//         const user = await this.prisma.user.findUnique({
//             where: {id: userId},
//             include: {profile: true}
//         })

//         if(!user || !user.profile) return null;

//         const text = `${user.profile.skills}. ${user.profile.bio || ''}. Goals: ${user.profile.goals} `;

//         const vector = await this.openai.embeddings.create({
//             model: 'text-embedding-3-small',
//             input: text
//         })

//         // const vector = response.data[0].embedding;
//         // const vector = mockEmbedding(text)

//         // converting TS array into a postgres array literal
//         // const vectorString = `ARRAY[${vector.join(',')}]::vector(1536)`;


//         // Use raw SQL to upsert
//        await this.prisma.$executeRaw`
//         INSERT INTO "Embedding" ("userId","embedding","createdAt","updatedAt")
//         VALUES (
//             ${userId},
//             ${vector}::vector,
//             now(),
//             now()
//         )
//         ON CONFLICT ("userId") DO UPDATE
//         SET embedding = ${vector}::vector,
//             "updatedAt" = now();
//         `;

//         return {
//             userId: userId,
//             embedding: vector
//         }

//     }
// }


import { Injectable } from '@nestjs/common';
import OpenAI from 'openai';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class EmbeddingsService {
  private openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  constructor(private readonly prisma: PrismaService) {}

  async generateAndSave(userId: string) {
    // 1. Fetch user + profile
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { profile: true },
    });

    if (!user) {
      throw new Error('User not found');
    }

    if (!user.profile) {
      throw new Error('Profile not found for user');
    }

    // 2. Build structured text for embedding
    const text = `
Profile Information:
Skills: ${user.profile.skills}
Bio: ${user.profile.bio || 'N/A'}
Goals: ${user.profile.goals}
Experience: ${user.profile.experience}
Availability: ${user.profile.availability}
Timezone: ${user.profile.timezone}
`.trim();

    // 3. Generate embedding from OpenAI
    const response = await this.openai.embeddings.create({
      model: 'text-embedding-3-small',
      input: text,
    });

    const vector = response.data[0].embedding;

    // 4. Convert JS array → pgvector format
    const vectorString = `[${vector.join(',')}]`;

    // 5. Upsert into PostgreSQL (pgvector)
    await this.prisma.$executeRaw`
INSERT INTO "Embedding" ("id", "userId", "embedding", "createdAt", "updatedAt")
VALUES (
  gen_random_uuid(),
  ${userId},
  ${vectorString}::vector,
  now(),
  now()
)
ON CONFLICT ("userId") DO UPDATE
SET embedding = ${vectorString}::vector,
    "updatedAt" = now();
`;

    // 6. Return result (optional)
    return {
      success: true,
      userId,
      embedding: vector,
    };
  }
}