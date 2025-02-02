import { Controller, Post, Param, Body, Get, UseGuards } from '@nestjs/common';
import { ChatService } from './chat.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('chats')
@UseGuards(JwtAuthGuard)
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  // Создание нового чата для пользователя
  @Post(':userId')
  createChat(@Param('userId') userId: number) {
    return this.chatService.createChat(userId);
  }

  // Получение всех сообщений чата
  @Get(':sessionId/messages')
  getMessages(@Param('sessionId') sessionId: string) {
    return this.chatService.getChatMessages(sessionId);
  }

  // Отправка сообщения в чат
  @Post(':sessionId/messages')
  sendMessage(
    @Param('sessionId') sessionId: string,
    @Body('sender') sender: string,
    @Body('content') content: string,
  ) {
    return this.chatService.sendMessage(sessionId, sender, content);
  }
}
