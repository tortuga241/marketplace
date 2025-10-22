import { UserService } from './account.service';
import { RequestRegisterDto } from "./dto/create-account-request.dto";
import { VerifyRegisterDto } from "./dto/create-account-verify.dto";
import { LoginDto } from "./dto/sign-in-account.dto";
import type { Response } from 'express';
export declare class UserController {
    private readonly userService;
    constructor(userService: UserService);
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
    login(dto: LoginDto, res: Response): Promise<{
        message: string;
        user: {
            id: string;
            login: string;
            email: string;
        };
    }>;
    getProfile(req: any): Promise<{
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
    logout(res: Response): Promise<{
        message: string;
    }>;
}
