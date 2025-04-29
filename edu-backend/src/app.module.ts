import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AiModule } from './ai/ai.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ChatModule } from './chat/chat.module';
import { ProductModule } from './product/product.module';

@Module({
  imports: [AiModule, AuthModule, UsersModule, ChatModule, ProductModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
