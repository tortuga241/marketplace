import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

export class orderDto {
    @ApiProperty({ example: '534890', description: '6-значный код подтверждения с почты' })
    @IsNotEmpty()
    verificationCode: string;
}