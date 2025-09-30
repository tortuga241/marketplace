import { Injectable, BadRequestException, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
// import { PrismaClient } from '../../app/generated/prisma';
import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import * as nodemailer from 'nodemailer';
import * as dotenv from 'dotenv';
import * as path from 'path';
import { JwtService } from '@nestjs/jwt';
import { RequestRegisterDto } from './dto/create-account-request.dto';
import { VerifyRegisterDto } from './dto/create-account-verify.dto';
import { LoginDto } from './dto/sign-in-account.dto';

const prisma = new PrismaClient();

@Injectable()
export class UserService {
  constructor(private jwtService: JwtService) {}
  // 1. Отправка кода
  async requestRegister(dto: RequestRegisterDto) {
    const { login, email, password } = dto;

    if (!login || !email || !password) {
      throw new BadRequestException('Все поля обязательны');
    }

    // Проверка email и login на уникальность
    const existingEmail = await prisma.account.findUnique({ where: { email } });
    if (existingEmail) throw new BadRequestException('Email уже используется');

    const existingLogin = await prisma.account.findFirst({ where: { login } });
    if (existingLogin) throw new BadRequestException('Логин уже используется');

    const hashedPassword = await bcrypt.hash(password, 10);
    const code = String(Math.floor(100000 + Math.random() * 900000));

    // Сохраняем во временной таблице
    await prisma.emailVerification.create({
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
    const { email, code } = dto;

    if (!email || !code) {
      throw new BadRequestException('Email и код обязательны');
    }

    // Ищем во временной таблице
    const pending = await prisma.emailVerification.findFirst({
      where: { email, code },
    });

    if (!pending) throw new BadRequestException('Неверный код или почта');

    // Создаём аккаунт
    const newAccount = await prisma.account.create({
      data: {
        login: pending.login,
        email: pending.email,
        password: pending.password,
        key: pending.key,
      },
    });

    // Удаляем временные данные
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

  // 3.Вход в аккаунт
  async login(dto: LoginDto) {
    const { email, password } = dto;

    const account = await prisma.account.findUnique({ where: { email } });
    if (!account) throw new UnauthorizedException('Неверный email или пароль');

    const isPasswordValid = await bcrypt.compare(password, account.password);
    if (!isPasswordValid)
      throw new UnauthorizedException('Неверный email или пароль');

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
}