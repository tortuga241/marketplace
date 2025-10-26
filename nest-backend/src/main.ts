// import { NestFactory } from '@nestjs/core';
// import { AppModule } from './app.module';
// import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

// const cookieParser = require('cookie-parser');

// async function bootstrap() {
//   const app = await NestFactory.create(AppModule);

//   app.use(cookieParser());

//   app.enableCors({
//     origin: 'http://localhost:3000', 
//     credentials: true,               
//   });

//   const config = new DocumentBuilder()
//     .setTitle('Market API')
//     .setDescription('Документация к моему API')
//     .setVersion('1.0')
//     .addTag('users')
//     .build();

//   const document = SwaggerModule.createDocument(app, config);
//   SwaggerModule.setup('api/docs', app, document);

//   await app.listen(process.env.PORT ?? 3001);
// }
// bootstrap();

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { writeFileSync } from 'fs';
import { resolve } from 'path';

const cookieParser = require('cookie-parser');

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(cookieParser());

  app.enableCors({
    origin: 'http://localhost:3000', 
    credentials: true,               
  });

  const config = new DocumentBuilder()
    .setTitle('Market API')
    .setDescription('Документация к моему API')
    .setVersion('1.0')
    .addTag('users')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  
  // ✅ ДОБАВЬТЕ ЭТИ СТРОКИ ДЛЯ СОХРАНЕНИЯ СХЕМЫ
  const outputPath = resolve(process.cwd(), 'openapi.json');
  writeFileSync(outputPath, JSON.stringify(document, null, 2));
  console.log(`✅ OpenAPI схема сохранена: ${outputPath}`);
  
  SwaggerModule.setup('api/docs', app, document);

  await app.listen(process.env.PORT ?? 3001);
}
bootstrap();