import { ApiProperty } from "@nestjs/swagger";

export class VerifyRegisterDto {
    @ApiProperty({ example: 'expamle@gmail.com', description: 'Email пользователя' })
    email: string;

    @ApiProperty({ example: '321654', description: 'Code подтверждения с почты' })
    code: string;
};