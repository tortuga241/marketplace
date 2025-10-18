import { Controller, Get, Post, Body, Res, UseGuards, Request, Param } from '@nestjs/common';
import { UserService } from './account.service';
import { RequestRegisterDto } from "./dto/create-account-request.dto";
import { VerifyRegisterDto } from "./dto/create-account-verify.dto";
import { ApiTags, ApiOperation, ApiResponse } from "@nestjs/swagger";
import { LoginDto } from "./dto/sign-in-account.dto";
import type { Response } from 'express';
import { AuthGuard } from '@nestjs/passport';

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
        console.log('Login controller started...');
        try {
            const data = await this.userService.login(dto);
            console.log('User service successful. Token:', data.token);

            res.cookie('jwt', data.token, {
                httpOnly: true,
                secure: process.env.USE_SECURE_COOKIE === 'true',
                sameSite: 'lax',
                maxAge: 7 * 24 * 60 * 60 * 1000,
            });
            console.log('Cookie has been set on the response object.');

            return {
                message: 'Вход успешен',
                user: data.account,
            };
        } catch (error) {
            console.error('Error in login controller:', error.message);
            throw error;
        }
    }

    // Получение данных текущего пользователя
    @Get('profile') 
    @UseGuards(AuthGuard('jwt'))
    @ApiOperation({ summary: 'Получение профиля текущего пользователя' })
    @ApiResponse({ status: 200, description: 'Данные пользователя.', schema: { example: { id: '...', login: 'testuser', email: 'test@example.com' } } })
    @ApiResponse({ status: 401, description: 'Пользователь не авторизован.' })
    getProfile(@Request() req) {
        const userId = req.user.id;
        return this.userService.getProfile(userId);
    }

    //Получение данных профиля по ID
    @Get(':id') 
    @ApiOperation({ summary: 'Получение профиля пользователя по ID' })
    @ApiResponse({ status: 200, description: 'Данные пользователя.' })
    @ApiResponse({ status: 404, description: 'Пользователь не найден.' })
    getProfileById(@Param('id') userId: string) {
        return this.userService.getProfileById(userId);
    }

    //Выход с аккаунта
    @Post('logout')
    @ApiOperation({ summary: 'Выход из аккаунта (очистка JWT cookie)' })
    @ApiResponse({ status: 200, description: 'Выход успешен, cookie удалены' })
    async logout(@Res({ passthrough: true }) res: Response) {
        res.cookie('jwt', '', {
            httpOnly: true,
            secure: process.env.USE_SECURE_COOKIE === 'true',
            sameSite: 'lax',
            maxAge: 0,
            expires: new Date(Date.now() -1000),
        });
        return {
            message: 'Выход успешен'
        }
    }
}