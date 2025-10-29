"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const swagger_1 = require("@nestjs/swagger");
const fs_1 = require("fs");
const path_1 = require("path");
const cookieParser = require('cookie-parser');
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.use(cookieParser());
    app.enableCors({
        origin: 'http://localhost:3000',
        credentials: true,
        allowedHeaders: [
            'Content-Type',
            'Authorization',
            'x-shop-id',
            'x-account-id'
        ],
    });
    const config = new swagger_1.DocumentBuilder()
        .setTitle('Market API')
        .setDescription('Документация к моему API')
        .setVersion('1.0')
        .addTag('users')
        .build();
    const document = swagger_1.SwaggerModule.createDocument(app, config);
    const outputPath = (0, path_1.resolve)(process.cwd(), 'openapi.json');
    (0, fs_1.writeFileSync)(outputPath, JSON.stringify(document, null, 2));
    console.log(`OpenAPI схема сохранена: ${outputPath}`);
    swagger_1.SwaggerModule.setup('api/docs', app, document);
    await app.listen(process.env.PORT ?? 3001);
}
bootstrap();
//# sourceMappingURL=main.js.map