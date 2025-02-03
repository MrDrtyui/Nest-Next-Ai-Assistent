import {
  Controller,
  Post,
  Body,
  HttpException,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { AiService } from './ai.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('ai')
@UseGuards(JwtAuthGuard)
export class AiController {
  constructor(private readonly aiService: AiService) {}

  @Post()
  async create(
    @Body() body: { data: string; sessionId: string; model?: string },
  ) {
    console.log('Получен запрос:', body);
    const { data, sessionId, model = 'qwen/qwen-turbo' } = body;

    if (!data || !sessionId) {
      throw new HttpException(
        'Неверные данные запроса',
        HttpStatus.BAD_REQUEST,
      );
    }

    try {
      const response = await this.aiService.getCompletionWithModel(data, model);
      return response;
    } catch (error) {
      console.error('Ошибка при получении ответа от модели:', error);
      throw new HttpException(
        'Ошибка при получении ответа от модели',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post('images')
  async createImage(@Body() body: { data: string; sessionId: string }) {
    console.log('Получен запрос:', body);
    if (!body.data || !body.sessionId) {
      throw new HttpException(
        'Неверные данные запроса',
        HttpStatus.BAD_REQUEST,
      );
    }

    try {
      const response = await this.aiService.searchVideo(body.data);
      return response;
    } catch (error) {
      console.error('Ошибка при поиске видео:', error);
      throw new HttpException(
        'Ошибка при поиске видео',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
