import { Injectable, Logger } from '@nestjs/common';
import axios from 'axios';
import OpenAI from 'openai';

@Injectable()
export class AiService {
  private openai: OpenAI;
  private logger = new Logger(AiService.name);

  constructor() {
    this.openai = new OpenAI({
      baseURL: 'https://openrouter.ai/api/v1',
      apiKey:
        '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', // Замените на ваш ключ API
      defaultHeaders: {
        'HTTP-Referer': process.env.SITE_URL, // Опционально. URL вашего сайта.
        'X-Title': process.env.SITE_NAME, // Опционально. Название вашего сайта.
      },
    });
  }

  async searchVideo(query: string): Promise<any> {
    try {
      // Получаем API ключ из переменных окружения
      const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;

      // Проверяем, что API ключ существует
      if (!YOUTUBE_API_KEY) {
        throw new Error('YouTube API key is missing in environment variables.');
      }

      // Выполняем запрос к YouTube API
      const response = await axios.get(
        `https://www.googleapis.com/youtube/v3/search`,
        {
          params: {
            part: 'snippet',
            maxResults: 1,
            q: query,
            key: YOUTUBE_API_KEY,
            type: 'video', // Указываем, что ищем только видео
          },
        },
      );

      // Проверяем, есть ли результаты в ответе
      if (response.data.items && response.data.items.length > 0) {
        const video = response.data.items[0];
        const videoId = video.id.videoId;
        const videoTitle = video.snippet.title;
        const videoThumbnail = video.snippet.thumbnails.high.url;
        const videoUrl = `https://www.youtube.com/watch?v=${videoId}`;

        // Возвращаем структурированный ответ
        return {
          data: {
            response: `Вот найденное видео: ${videoTitle}`,
            video: {
              url: videoUrl,
              title: videoTitle,
              thumbnail: videoThumbnail,
            },
          },
        };
      } else {
        // Если видео не найдено
        return {
          data: {
            response: 'Извините, видео не найдено.',
          },
        };
      }
    } catch (error) {
      // Логируем ошибку
      this.logger.error('Ошибка при поиске видео:', error);

      // Возвращаем понятное сообщение об ошибке
      throw new Error('Не удалось найти видео. Пожалуйста, попробуйте позже.');
    }
  }

  async getCompletionWithModel(prompt: string, model: string): Promise<any> {
    const lowerPrompt = prompt.toLowerCase();
    if (
      lowerPrompt.includes('найди видео') ||
      lowerPrompt.includes('найди ролик')
    ) {
      return this.searchVideo(prompt);
    }

    const availableModels = [
      'qwen/qwen-turbo',
      'gpt-3.5-turbo',
      'deepseek/deepseek-r1:free',
      'sophosympatheia/rogue-rose-103b-v0.2:free',
    ];

    if (!availableModels.includes(model)) {
      return {
        data: { response: `Ошибка: модель '${model}' не поддерживается.` },
      };
    }

    try {
      const completion = await this.openai.chat.completions.create({
        model,
        messages: [
          {
            role: 'system',
            content:
              'Ты образовательный ассистент.Ты должен  помогать  студенам. Отвечай четко и по делу.',
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
      });

      console.log(completion);
      return { data: { response: completion.choices[0].message.content } };
    } catch (error) {
      this.logger.error('Ошибка при получении ответа от модели', error.message);
      return { data: { response: 'Не удалось получить ответ от модели.' } };
    }
  }
}
