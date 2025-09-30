import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import * as dotenv from 'dotenv';
import * as path from 'path';

//Принудительно указываем на путь к файлу .env так как nestJS его не видит
dotenv.config({ path: path.resolve(__dirname, '..', '.env') });
console.log('>>> DATABASE_URL (dotenv):', process.env.DATABASE_URL);

//Импорт основных модулей проекта
import { AccountMoule } from './account/account.module';
import { ShopModule } from './shop/shop.module';

@Module({
  //Сюда импортируем все модули
  imports: [ 
    ConfigModule.forRoot({ isGlobal: true }),
    AccountMoule,
    ShopModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}