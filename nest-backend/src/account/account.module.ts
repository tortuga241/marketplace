import { Module } from "@nestjs/common";
import { UserController } from "./account.controller";
import { UserService } from "./account.service";

//Модуль для коректной работы аккаунта
@Module({
    controllers: [UserController],
    providers: [UserService]
})

export class AccountMoule {};