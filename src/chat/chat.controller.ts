import {
    Body,
    Controller,
    Get,
    Param,
    Post,
    Req,
    UseGuards,
  } from '@nestjs/common';
  
  import { ChatService } from './chat.service';
  import { JwtAuthGuard } from '../auth/guards/jwt.guard';
  
  @Controller('chat')
  @UseGuards(JwtAuthGuard)
  export class ChatController {
    constructor(
      private readonly chatService: ChatService,
    ) {}
  
    @Get(':id/messages')
    async getMessages(
      @Param('id') id: string,
      @Req() req: any,
    ) {
      return this.chatService.getMessages(
        req.user.id,
        id,
      );
    }
  
    @Post(':id/messages')
    async sendMessage(
      @Param('id') id: string,
      @Body() body: { content: string },
      @Req() req: any,
    ) {
      return this.chatService.sendMessage(
        req.user.id,
        id,
        body.content,
      );
    }
  
    @Get(':id')
    async getConversation(
      @Param('id') id: string,
      @Req() req: any,
    ) {
      return this.chatService.getOrCreateConversation(
        req.user.id,
        id,
      );
    }
  }