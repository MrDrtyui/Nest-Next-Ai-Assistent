import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  constructor(private prisma: PrismaService) { }

  // Поиск пользователя по email
  async findOneByEmail(email: string) {
    this.logger.debug(`Поиск пользователя по email: ${email}`);
    return this.prisma.user.findUnique({
      where: { email },
    });
  }

  // Создание нового пользователя
  async create(data: { email: string; password: string }) {
    this.logger.log(`Создание нового пользователя: ${data.email}`);

    // Проверяем, существует ли уже пользователь с таким email
    const existingUser = await this.findOneByEmail(data.email);
    if (existingUser) {
      this.logger.warn(`Попытка создания дубликата: ${data.email}`);
      throw new Error('Пользователь с таким email уже существует');
    }

    // Если пользователь не существует, создаем нового
    const newUser = await this.prisma.user.create({
      data,
    });

    this.logger.log(`Пользователь ${data.email} успешно создан`);
    return newUser;
  }
}
