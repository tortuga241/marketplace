"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = void 0;
const common_1 = require("@nestjs/common");
const account_service_1 = require("./account.service");
const create_account_request_dto_1 = require("./dto/create-account-request.dto");
const create_account_verify_dto_1 = require("./dto/create-account-verify.dto");
const swagger_1 = require("@nestjs/swagger");
const sign_in_account_dto_1 = require("./dto/sign-in-account.dto");
const passport_1 = require("@nestjs/passport");
let UserController = class UserController {
    userService;
    constructor(userService) {
        this.userService = userService;
    }
    requestRegister(dto) {
        return this.userService.requestRegister(dto);
    }
    verifyRegister(dto) {
        return this.userService.verifyRegister(dto);
    }
    async login(dto, res) {
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
        }
        catch (error) {
            console.error('Error in login controller:', error.message);
            throw error;
        }
    }
    getProfile(req) {
        const userId = req.user.id;
        return this.userService.getProfile(userId);
    }
    async logout(res) {
        res.cookie('jwt', '', {
            httpOnly: true,
            secure: process.env.USE_SECURE_COOKIE === 'true',
            sameSite: 'lax',
            maxAge: 0,
            expires: new Date(Date.now() - 1000),
        });
        return {
            message: 'Выход успешен'
        };
    }
};
exports.UserController = UserController;
__decorate([
    (0, common_1.Post)('request-register'),
    (0, swagger_1.ApiOperation)({ summary: 'Запрос на регистрацию (отправка кода на почту)' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Код отправлен на почту.' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Ошибка валидации данных.' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_account_request_dto_1.RequestRegisterDto]),
    __metadata("design:returntype", void 0)
], UserController.prototype, "requestRegister", null);
__decorate([
    (0, common_1.Post)('verify-register'),
    (0, swagger_1.ApiOperation)({ summary: 'Подтверждение регистрации (по коду из почты)' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Аккаунт успешно зарегистрирован.' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Неверный код подтверждения.' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_account_verify_dto_1.VerifyRegisterDto]),
    __metadata("design:returntype", void 0)
], UserController.prototype, "verifyRegister", null);
__decorate([
    (0, common_1.Post)('login'),
    (0, swagger_1.ApiOperation)({ summary: 'Вход в аккаунт (получение JWT)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Вход успешен, cookie установлена.' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Неверный email или пароль.' }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Res)({ passthrough: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [sign_in_account_dto_1.LoginDto, Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "login", null);
__decorate([
    (0, common_1.Get)('profile'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    (0, swagger_1.ApiOperation)({ summary: 'Получение профиля текущего пользователя' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Данные пользователя.', schema: { example: { id: '...', login: 'testuser', email: 'test@example.com' } } }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Пользователь не авторизован.' }),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], UserController.prototype, "getProfile", null);
__decorate([
    (0, common_1.Post)('logout'),
    (0, swagger_1.ApiOperation)({ summary: 'Выход из аккаунта (очистка JWT cookie)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Выход успешен, cookie удалены' }),
    __param(0, (0, common_1.Res)({ passthrough: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "logout", null);
exports.UserController = UserController = __decorate([
    (0, swagger_1.ApiTags)('User'),
    (0, common_1.Controller)('user'),
    __metadata("design:paramtypes", [account_service_1.UserService])
], UserController);
//# sourceMappingURL=account.controller.js.map