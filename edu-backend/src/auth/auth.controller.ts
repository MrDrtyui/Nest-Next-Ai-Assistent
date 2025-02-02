import {
  Controller,
  Post,
  Body,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';

@Controller('auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);

  constructor(
    private authService: AuthService,
    private usersService: UsersService,
  ) { }

  // Регистрация пользователя
  @Post('register')
  async register(@Body() body: { email: string; password: string }) {
    const { email, password } = body;
    this.logger.log(`Попытка регистрации: ${email}`);

    // Проверяем, существует ли пользователь с таким email
    const existingUser = await this.usersService.findOneByEmail(email);
    if (existingUser) {
      this.logger.warn(
        `Регистрация отклонена: пользователь ${email} уже существует`,
      );
      throw new HttpException(
        'Пользователь с таким email уже существует',
        HttpStatus.BAD_REQUEST,
      );
    }

    // Хэшируем пароль
    const hashedPassword = await bcrypt.hash(password, 10);

    // Создаем нового пользователя
    const newUser = await this.usersService.create({
      email,
      password: hashedPassword,
    });

    this.logger.log(`Пользователь ${email} успешно зарегистрирован`);
    return newUser;
  }

  // Логин и получение токена
  @Post('login')
  async login(@Body() body: { email: string; password: string }) {
    this.logger.log(`Попытка входа: ${body.email}`);

    const user = await this.authService.validateUser(body.email, body.password);
    if (!user) {
      this.logger.warn(`Неудачная попытка входа: ${body.email}`);
      return { message: 'Invalid credentials' };
    }

    this.logger.log(`Пользователь ${body.email} успешно вошел`);
    return this.authService.login(user);
  }
}
