import { ApiProperty } from "@nestjs/swagger";

export class LoginDto {
    @ApiProperty({ example: 'example@gmail.com', description: 'Email пользователя' })
    email: string;

    @ApiProperty({ example: 'strongPassword123', description: 'Пароль пользователя' })
    password: string;
};