import { JwtService } from '@nestjs/jwt';
import { RequestRegisterDto } from './dto/create-account-request.dto';
import { VerifyRegisterDto } from './dto/create-account-verify.dto';
import { LoginDto } from './dto/sign-in-account.dto';
export declare class UserService {
    private jwtService;
    constructor(jwtService: JwtService);
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
}
