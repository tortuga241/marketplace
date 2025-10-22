import { JwtService } from '@nestjs/jwt';
import { Response } from 'express';
import { PrismaService } from '../prisma/prisma.service';
import { RequestRegisterDto } from './dto/create-account-request.dto';
import { VerifyRegisterDto } from './dto/create-account-verify.dto';
import { LoginDto } from './dto/sign-in-account.dto';
export declare class UserService {
    private jwtService;
    private readonly prisma;
    constructor(jwtService: JwtService, prisma: PrismaService);
    requestRegister(dto: RequestRegisterDto): Promise<{
        message: string;
    }>;
    verifyRegister(dto: VerifyRegisterDto): Promise<{
        message: string;
        account: {
            id: string;
            email: string;
            key: string;
        };
    }>;
    login(dto: LoginDto): Promise<{
        message: string;
        token: string;
        account: {
            id: string;
            login: string;
            email: string;
        };
    }>;
    logout(res: Response): Promise<{
        message: string;
    }>;
    getProfile(userId: string): Promise<{
        shop: {
            type: string;
            description: string;
            title: string;
            id: string;
            createdAt: Date;
        } | null;
        login: string;
        email: string;
        id: string;
    }>;
    getProfileById(userId: string): Promise<{
        shop: {
            type: string;
            description: string;
            title: string;
            id: string;
            createdAt: Date;
        } | null;
        login: string;
        email: string;
        id: string;
    }>;
}
