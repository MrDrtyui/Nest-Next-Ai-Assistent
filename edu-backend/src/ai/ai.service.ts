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
      apiKey: process.env.OPENROUTER_API_KEY, // Замените на ваш ключ API
      defaultHeaders: {
        'HTTP-Referer': process.env.SITE_URL, // Опционально. URL вашего сайта.
        'X-Title': process.env.SITE_NAME, // Опционально. Название вашего сайта.
      },
    });
  }

  async searchVideo(query: string): Promise<any> {
    try {
      const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;
      const response = await axios.get(
        `https://www.googleapis.com/youtube/v3/search`,
        {
          params: {
            part: 'snippet',
            maxResults: 1,
            q: query,
            key: YOUTUBE_API_KEY,
          },
        },
      );

      if (response.data.items && response.data.items.length) {
        const video = response.data.items[0];
        const videoId = video.id.videoId;
        const videoTitle = video.snippet.title;
        const videoThumbnail = video.snippet.thumbnails.high.url;
        const videoUrl = `https://www.youtube.com/watch?v=${videoId}`;

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
        return { data: { response: 'Извините, видео не найдено.' } };
      }
    } catch (error) {
      this.logger.error('Ошибка при поиске видео', error);
      throw new Error('Не удалось найти видео');
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
            content: 'Ты образовательный ассистент. Отвечай четко и по делу.',
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
      });

      return { data: { response: completion.choices[0].message.content } };
    } catch (error) {
      this.logger.error('Ошибка при получении ответа от модели', error);
      return { data: { response: 'Не удалось получить ответ от модели.' } };
    }
  }
}
