import {
    BadRequestException,
    Injectable,
    NotFoundException,
  } from '@nestjs/common';
  
  import { PrismaService } from '../prisma/prisma.service';
  
  @Injectable()
  export class ChatService {
    constructor(
      private readonly prisma: PrismaService,
    ) {}
  
    async getOrCreateConversation(
      currentUserId: string,
      otherUserId: string,
    ) {
      if (currentUserId === otherUserId) {
        throw new BadRequestException(
          'You cannot chat with yourself',
        );
      }
  
      const otherUser =
        await this.prisma.user.findUnique({
          where: {
            id: otherUserId,
          },
          select: {
            id: true,
            name: true,
            image: true,
          },
        });
  
      if (!otherUser) {
        throw new NotFoundException(
          'User not found',
        );
      }
  
      const existingConversation =
        await this.prisma.conversation.findFirst({
          where: {
            participants: {
              every: {
                userId: {
                  in: [
                    currentUserId,
                    otherUserId,
                  ],
                },
              },
            },
  
            AND: [
              {
                participants: {
                  some: {
                    userId: currentUserId,
                  },
                },
              },
              {
                participants: {
                  some: {
                    userId: otherUserId,
                  },
                },
              },
            ],
          },
  
          include: {
            participants: {
              include: {
                user: {
                  select: {
                    id: true,
                    name: true,
                    image: true,
                  },
                },
              },
            },
  
            messages: {
              orderBy: {
                createdAt: 'asc',
              },
            },
          },
        });
  
      if (existingConversation) {
        return existingConversation;
      }
  
      return this.prisma.conversation.create({
        data: {
          participants: {
            create: [
              {
                userId: currentUserId,
              },
              {
                userId: otherUserId,
              },
            ],
          },
        },
  
        include: {
          participants: {
            include: {
              user: {
                select: {
                  id: true,
                  name: true,
                  image: true,
                },
              },
            },
          },
  
          messages: {
            orderBy: {
              createdAt: 'asc',
            },
          },
        },
      });
    }
  
    async getMessages(
      currentUserId: string,
      otherUserId: string,
    ) {
      const conversation =
        await this.getOrCreateConversation(
          currentUserId,
          otherUserId,
        );
  
      return {
        success: true,
        conversationId: conversation.id,
        messages: conversation.messages,
      };
    }
  
    async sendMessage(
      currentUserId: string,
      otherUserId: string,
      content: string,
    ) {
      const trimmedContent =
        content.trim();
  
      if (!trimmedContent) {
        throw new BadRequestException(
          'Message cannot be empty',
        );
      }
  
      const conversation =
        await this.getOrCreateConversation(
          currentUserId,
          otherUserId,
        );
  
      const participant =
        conversation.participants.find(
          (participant) =>
            participant.userId ===
            currentUserId,
        );
  
      if (!participant) {
        throw new BadRequestException(
          'You are not part of this conversation',
        );
      }
  
      return this.prisma.message.create({
        data: {
          conversationId:
            conversation.id,
  
          senderId: currentUserId,
  
          content: trimmedContent,
        },
  
        select: {
          id: true,
          content: true,
          senderId: true,
          createdAt: true,
        },
      });
    }
  }