import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsUUID, Length } from 'class-validator';

export class CompleteOrderDto {
  @ApiProperty({ description: 'ID записи о верификации (из /initiate)' })
  @IsUUID()
  verificationId: string;

  @ApiProperty({ description: '6-значный код из письма' })
  @IsString()
  @Length(6, 6, { message: 'Код должен состоять из 6 цифр' })
  code: string;
}