import { Controller, Post, Get, Body, Res } from "@nestjs/common";
import { UserService } from './account.service';
import { RequestRegisterDto } from "./dto/create-account-request.dto";
import { VerifyRegisterDto } from "./dto/create-account-verify.dto";
import { ApiTags, ApiOperation, ApiResponse } from "@nestjs/swagger";
import { LoginDto } from "./dto/sign-in-account.dto";
import { ApiBearerAuth } from "@nestjs/swagger";
import type { Response } from 'express';

@ApiTags('User')
@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService) {}

    // Регистрация временного аккаунта для подтверждения почты
    @Post('request-register')
    @ApiOperation({ summary: 'Запрос на регистрацию (отправка кода на почту)' })
    @ApiResponse({ status: 201, description: 'Код отправлен на почту.' })
    @ApiResponse({ status: 400, description: 'Ошибка валидации данных.' })
    requestRegister(@Body() dto: RequestRegisterDto) {
        return this.userService.requestRegister(dto);
    }

    // Регистрация полноценного аккаунта (после подтверждения почты)
    @Post('verify-register')
    @ApiOperation({ summary: 'Подтверждение регистрации (по коду из почты)' })
    @ApiResponse({ status: 201, description: 'Аккаунт успешно зарегистрирован.' })
    @ApiResponse({ status: 400, description: 'Неверный код подтверждения.' })
    verifyRegister(@Body() dto: VerifyRegisterDto) {
        return this.userService.verifyRegister(dto);
    }

    // Вход в аккаунт
    @Post('login')
    @ApiOperation({ summary: 'Вход в аккаунт (получение JWT)' })
    @ApiResponse({ status: 200, description: 'Вход успешен, cookie установлена.' })
    @ApiResponse({ status: 401, description: 'Неверный email или пароль.' })
    async login(@Body() dto: LoginDto, @Res({ passthrough: true }) res: Response) {
        const data = await this.userService.login(dto);

        // ✅ Устанавливаем cookie
        res.cookie('jwt', data.token, {
        httpOnly: true,     // нельзя прочитать из JS (безопасность)
        secure: false,      // true если HTTPS
        sameSite: 'lax',    // защита от CSRF
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 дней
        });

        // ✅ Обязательно возвращаем ответ
        return {
        message: 'Вход успешен',
        user: data.account,
        };
    }
}