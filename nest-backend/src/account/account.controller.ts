import { Controller, Post, Get, Body } from "@nestjs/common";
import { UserService } from './account.service';
import { RequestRegisterDto } from "./dto/create-account-request.dto";
import { VerifyRegisterDto } from "./dto/create-account-verify.dto";
import { ApiTags, ApiOperation, ApiResponse } from "@nestjs/swagger";
import { LoginDto } from "./dto/sign-in-account.dto";
import { ApiBearerAuth } from "@nestjs/swagger";

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
    @ApiResponse({ status: 200, description: 'Вход успешен, возвращается JWT и данные пользователя.' })
    @ApiResponse({ status: 401, description: 'Неверный email или пароль.' })
    login(@Body() dto: LoginDto) {
        return this.userService.login(dto);
    }
};