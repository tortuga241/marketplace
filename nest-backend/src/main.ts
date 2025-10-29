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
    allowedHeaders: [//
      'Content-Type', //
      'Authorization', //
      'x-shop-id', //
      'x-account-id'//
    ],//
  });

  const config = new DocumentBuilder()
    .setTitle('Market API')
    .setDescription('Документация к моему API')
    .setVersion('1.0')
    .addTag('users')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  
  const outputPath = resolve(process.cwd(), 'openapi.json');
  writeFileSync(outputPath, JSON.stringify(document, null, 2));
  console.log(`OpenAPI схема сохранена: ${outputPath}`);
  
  SwaggerModule.setup('api/docs', app, document);

  await app.listen(process.env.PORT ?? 3001);
}
bootstrap();