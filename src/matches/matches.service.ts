import {
    BadRequestException,
    Injectable,
    NotFoundException,
  } from '@nestjs/common';
  
  import { PrismaService } from 'src/prisma/prisma.service';
  
  @Injectable()
  export class MatchesService {
    constructor(
      private readonly prisma: PrismaService,
    ) {}
  
    async createMatch(
      currentUserId: string,
      otherUserId: string,
    ) {
      // Prevent matching with yourself
      if (currentUserId === otherUserId) {
        throw new BadRequestException(
          'You cannot match with yourself',
        );
      }
  
      // Check whether the selected user exists
      const otherUser = await this.prisma.user.findUnique({
        where: {
          id: otherUserId,
        },
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
        },
      });
  
      if (!otherUser) {
        throw new NotFoundException('User not found');
      }
  
      // Check both directions because:
      // A -> B and B -> A are logically the same match
      const existingMatch = await this.prisma.match.findFirst({
        where: {
          OR: [
            {
              userAId: currentUserId,
              userBId: otherUserId,
            },
            {
              userAId: otherUserId,
              userBId: currentUserId,
            },
          ],
        },
      });
  
      if (existingMatch) {
        throw new BadRequestException(
          'You are already matched with this user',
        );
      }
  
      // Store IDs in a consistent order
      const [userAId, userBId] = [
        currentUserId,
        otherUserId,
      ].sort();
  
      const match = await this.prisma.match.create({
        data: {
          userAId,
          userBId,
        },
        include: {
          userA: {
            select: {
              id: true,
              name: true,
              email: true,
              image: true,
            },
          },
          userB: {
            select: {
              id: true,
              name: true,
              email: true,
              image: true,
            },
          },
        },
      });
  
      return {
        message: 'Match created successfully',
        match,
      };
    }

    async getMyMatches(userId: string) {
        const matches = await this.prisma.match.findMany({
          where: {
            OR: [
              {
                userAId: userId,
              },
              {
                userBId: userId,
              },
            ],
          },
    
          include: {
            userA: {
              select: {
                id: true,
                name: true,
                email: true,
                image: true,
    
                profile: {
                  select: {
                    id: true,
                    bio: true,
                    experience: true,
                    skills: true,
                    goals: true,
                    availability: true,
                    timezone: true,
                  },
                },
              },
            },
    
            userB: {
              select: {
                id: true,
                name: true,
                email: true,
                image: true,
    
                profile: {
                  select: {
                    id: true,
                    bio: true,
                    experience: true,
                    skills: true,
                    goals: true,
                    availability: true,
                    timezone: true,
                  },
                },
              },
            },
          },
    
          orderBy: {
            createdAt: 'desc',
          },
        });
    
        const formattedMatches = matches.map((match) => {
          const otherUser =
            match.userAId === userId
              ? match.userB
              : match.userA;
    
          return {
            id: match.id,
            createdAt: match.createdAt,
            updatedAt: match.updatedAt,
    
            user: otherUser,
          };
        });
    
        return {
          success: true,
          count: formattedMatches.length,
          data: formattedMatches,
        };
      }

      async getRecentMatches(userId: string) {
        const twoWeeksAgo = new Date();
      
        twoWeeksAgo.setDate(
          twoWeeksAgo.getDate() - 14,
        );
      
        const matches = await this.prisma.match.findMany({
          where: {
            AND: [
              {
                OR: [
                  {
                    userAId: userId,
                  },
                  {
                    userBId: userId,
                  },
                ],
              },
              {
                createdAt: {
                  gte: twoWeeksAgo,
                },
              },
            ],
          },
      
          include: {
            userA: {
              select: {
                id: true,
                name: true,
                image: true,
      
                profile: {
                  select: {
                    id: true,
                    bio: true,
                    experience: true,
                    skills: true,
                    goals: true,
                    availability: true,
                    timezone: true,
                  },
                },
              },
            },
      
            userB: {
              select: {
                id: true,
                name: true,
                image: true,
      
                profile: {
                  select: {
                    id: true,
                    bio: true,
                    experience: true,
                    skills: true,
                    goals: true,
                    availability: true,
                    timezone: true,
                  },
                },
              },
            },
          },
      
          orderBy: {
            createdAt: 'desc',
          },
        });
      
        const formattedMatches = matches.map((match) => {
          const otherUser =
            match.userAId === userId
              ? match.userB
              : match.userA;
      
          return {
            id: match.id,
            createdAt: match.createdAt,
            updatedAt: match.updatedAt,
            user: otherUser,
          };
        });
      
        return {
          success: true,
          count: formattedMatches.length,
          data: formattedMatches,
        };
      }
}