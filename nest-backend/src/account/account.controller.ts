import { Controller, Post, Body } from "@nestjs/common";
import { UserService } from './account.service';
import { RequestRegisterDto } from "./dto/create-account-request.dto";
import { VerifyRegisterDto } from "./dto/create-account-verify.dto";

@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService) {}

    //Регистрация временного аккаунта (для подтверждения почты)
    @Post('request-register')
    requestRegister(@Body() dto: RequestRegisterDto) {
        return this.userService.requestRegister(dto);
    };
    //Регистрация полноценного аккаунта (после успешного подтверждения почты)
    @Post('verify-register')
    verifyRegister(@Body() dto: VerifyRegisterDto) {
        return this.userService.verifyRegister(dto);
    };
};