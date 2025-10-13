import { Module, NestModule, MiddlewareConsumer  } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import * as dotenv from 'dotenv';
import * as path from 'path';

//Импорт основных модулей проекта
import { AccountMoule } from './account/account.module';
import { ShopModule } from './shop/shop.module';
import { JwtCookieMiddleware } from './auth/jwt-cookie.middleware';
import { AuthModule } from './auth/auth.module';

//Принудительно указываем на путь к файлу .env так как nestJS его не видит
dotenv.config({ path: path.resolve(__dirname, '..', '.env') });
console.log('>>> DATABASE_URL (dotenv):', process.env.DATABASE_URL);

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    AccountMoule,
    ShopModule,
    AuthModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(JwtCookieMiddleware)
      .forRoutes('*'); 
  }
}