"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const common_1 = require("@nestjs/common");
const prisma_1 = require("../../app/generated/prisma");
const bcrypt = __importStar(require("bcrypt"));
const uuid_1 = require("uuid");
const nodemailer = __importStar(require("nodemailer"));
const prisma = new prisma_1.PrismaClient();
let UserService = class UserService {
    async requestRegister(dto) {
        const { login, email, password } = dto;
        if (!login || !email || !password) {
            throw new common_1.BadRequestException('Все поля обязательны');
        }
        const existingEmail = await prisma.account.findUnique({ where: { email } });
        if (existingEmail)
            throw new common_1.BadRequestException('Email уже используется');
        const existingLogin = await prisma.account.findFirst({ where: { login } });
        if (existingLogin)
            throw new common_1.BadRequestException('Логин уже используется');
        const hashedPassword = await bcrypt.hash(password, 10);
        const code = String(Math.floor(100000 + Math.random() * 900000));
        await prisma.emailVerification.create({
            data: {
                login,
                email,
                password: hashedPassword,
                key: (0, uuid_1.v4)(),
                code,
            },
        });
        try {
            const transporter = nodemailer.createTransport({
                host: 'smtp.gmail.com',
                port: 587,
                secure: false,
                auth: {
                    user: process.env.EMAIL_USER,
                    pass: process.env.EMAIL_PASS,
                },
            });
            console.log(process.env.EMAIL_PASS);
            await transporter.sendMail({
                from: `"Your App" <${process.env.EMAIL_USER}>`,
                to: email,
                subject: 'Подтверждение регистрации',
                text: `Ваш код подтверждения: ${code}`,
            });
        }
        catch (error) {
            throw new common_1.InternalServerErrorException('Ошибка при отправке письма');
        }
        return { message: 'Код отправлен на почту' };
    }
    async verifyRegister(dto) {
        const { email, code } = dto;
        if (!email || !code) {
            throw new common_1.BadRequestException('Email и код обязательны');
        }
        const pending = await prisma.emailVerification.findFirst({
            where: { email, code },
        });
        if (!pending)
            throw new common_1.BadRequestException('Неверный код или почта');
        const newAccount = await prisma.account.create({
            data: {
                login: pending.login,
                email: pending.email,
                password: pending.password,
                key: pending.key,
            },
        });
        await prisma.emailVerification.delete({ where: { id: pending.id } });
        return {
            message: 'Регистрация завершена',
            account: {
                id: newAccount.id,
                email: newAccount.email,
                key: newAccount.key,
            },
        };
    }
};
exports.UserService = UserService;
exports.UserService = UserService = __decorate([
    (0, common_1.Injectable)()
], UserService);
;
//# sourceMappingURL=account.service.js.map