import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service'; // Ваш сервис для работы с Prisma

@Injectable()
export class ChatService {
  constructor(private prisma: PrismaService) {}

  // Создание нового чата для пользователя
  async createChat(userId: number) {
    return this.prisma.chatSession.create({
      data: {
        userId,
      },
    });
  }

  // Получение всех сообщений чата
  async getChatMessages(sessionId: string) {
    return this.prisma.message.findMany({
      where: { sessionId },
      orderBy: { createdAt: 'asc' },
    });
  }

  // Отправка нового сообщения в чат
  async sendMessage(sessionId: string, sender: string, content: string) {
    return this.prisma.message.create({
      data: {
        sessionId,
        sender,
        content,
      },
    });
  }
}
