import { ApiProperty } from "@nestjs/swagger";

export class RequestRegisterDto {
    @ApiProperty({ example: 'Bob', description: 'Login пользователя' })
    login: string;

    @ApiProperty({ example: 'example@gmail.com', description: 'Email пользователя' })
    email: string;

    @ApiProperty({ example: 'qwerty', description: 'Password пользователя' })
    password: string;
};