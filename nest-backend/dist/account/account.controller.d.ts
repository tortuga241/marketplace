import { UserService } from './account.service';
import { RequestRegisterDto } from "./dto/create-account-request.dto";
import { VerifyRegisterDto } from "./dto/create-account-verify.dto";
import { LoginDto } from "./dto/sign-in-account.dto";
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
