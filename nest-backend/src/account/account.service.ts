import { Injectable, BadRequestException, InternalServerErrorException, UnauthorizedException, NotFoundException } from '@nestjs/common';
import { PrismaClient, Prisma } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import * as nodemailer from 'nodemailer';
import { JwtService } from '@nestjs/jwt';
import { Response } from 'express';

import { PrismaService } from '../prisma/prisma.service'; 

import { RequestRegisterDto } from './dto/create-account-request.dto';
import { VerifyRegisterDto } from './dto/create-account-verify.dto';
import { LoginDto } from './dto/sign-in-account.dto';


@Injectable()
export class UserService {

    constructor(
        private jwtService: JwtService,
        private readonly prisma: PrismaService, 
    ) {}
    
    // 1. Отправка кода
    async requestRegister(dto: RequestRegisterDto) {
        const { login, email, password } = dto;

        if (!login || !email || !password) {
            throw new BadRequestException('Все поля обязательны');
        }

        // Проверка email и login на уникальность
        const existingEmail = await this.prisma.account.findUnique({ where: { email } });
        if (existingEmail) throw new BadRequestException('Email уже используется');

        const existingLogin = await this.prisma.account.findFirst({ where: { login } });
        if (existingLogin) throw new BadRequestException('Логин уже используется');

        const hashedPassword = await bcrypt.hash(password, 10);
        const code = String(Math.floor(100000 + Math.random() * 900000));

        // Сохраняем во временной таблице
        await this.prisma.emailVerification.create({ 
            data: {
                login,
                email,
                password: hashedPassword,
                key: uuidv4(),
                code,
            },
        });

        // Отправляем письмо
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
        } catch (error) {
            throw new InternalServerErrorException('Ошибка при отправке письма');
        }

        return { message: 'Код отправлен на почту' };
    }

    // 2. Проверка кода и создание аккаунта
    async verifyRegister(dto: VerifyRegisterDto) {
        const {  code } = dto;

        if (!code) {
            throw new BadRequestException('Email и код обязательны');
        }

        // Ищем во временной таблице
        const pending = await this.prisma.emailVerification.findFirst({ 
            where: { code },
        });

        if (!pending) throw new BadRequestException('Неверный код');

        const existingLogin = await this.prisma.account.findUnique({ 
            where: { login: pending.login },
        });
        if (existingLogin) throw new BadRequestException('Логин уже используется');

        const existingEmail = await this.prisma.account.findUnique({ 
            where: { email: pending.email },
        });
        if (existingEmail) throw new BadRequestException('Email уже используется');


        // Создаём аккаунт
        try {
            const newAccount = await this.prisma.account.create({
                data: {
                    login: pending.login,
                    email: pending.email,
                    password: pending.password,
                    key: pending.key,
                    isVerified: true
                },
            });

            // Удаляем временные данные
            await this.prisma.emailVerification.delete({ where: { id: pending.id } }); 

            return {
                message: 'Регистрация завершена',
                account: {
                    id: newAccount.id,
                    email: newAccount.email,
                    key: newAccount.key,
                },
            };
        }
        catch (error: any) {
            if (error.code === 'P2002') {
                throw new BadRequestException('Такой логин или email уже существует');
            }
            throw error;
        }
    }

    // 3. Вход в аккаунт
    async login(dto: LoginDto) {

        const { email, password } = dto;
        const account = await this.prisma.account.findUnique({ where: { email } }); 

        if (!account) throw new UnauthorizedException('Неверный email или пароль');
        
        const isPasswordValid = await bcrypt.compare(password, account.password);
        if (!isPasswordValid) throw new UnauthorizedException('Неверный email или пароль');

        const payload = { userId: account.id, email: account.email };
        const token = this.jwtService.sign(payload);

        return {
            message: 'Вход успешен',
            token,
            account: {
                id: account.id,
                login: account.login,
                email: account.email,
            },
        };
    }
    
    // Выход
    async logout(res: Response) {
        res.clearCookie('jwt');
        return { message: 'Вы вышли из аккаунта' };
    }


    // 4. Получение данных профиля ТЕКУЩЕГО пользователя (protected route)
    async getProfile(userId: string) {
        const account = await this.prisma.account.findUnique({ 
            where: {
                id: userId,
            },
            select: {
              id: true,
              login: true,
              email: true,
              shop: {   //Если проект ляжет возможно убрать
                  select: {
                      id: true,
                      title: true,
                      description: true,
                      type: true,
                      createdAt: true
                  }
              },
            },
        });

        if (!account) {
            throw new UnauthorizedException('Пользователь не найден');
        }

        return account;
    }
    
    //GET запрос на получение профиля по ID
    async getProfileById(userId: string) {
        const account = await this.prisma.account.findUnique({ 
            where: {
                id: userId,
            },
            select: {
              id: true,
              login: true,
              email: true,
              shop: { 
                  select: {
                      id: true,
                      title: true,
                      description: true,
                      type: true,
                      createdAt: true
                  }
              },
            },
        });

        if (!account) {
            throw new NotFoundException(`Пользователь с ID "${userId}" не найден.`); 
        }

        return account;
    }
}