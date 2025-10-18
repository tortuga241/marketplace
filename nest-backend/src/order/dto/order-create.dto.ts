import { IsNotEmpty, IsUUID, IsEmail, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateOrderDto {
  @ApiProperty({ example: 'a1b2c3d4-e5f6-7890-1234-567890abcdef', description: 'ID лота, который покупается' })
  @IsUUID()
  @IsNotEmpty()
  lotId: string;

  @ApiProperty({ example: 'buyer-uuid-123', description: 'ID аккаунта покупателя' })
  @IsUUID()
  @IsNotEmpty()
  buyerAccountId: string;

  @ApiProperty({ example: 'user@example.com', description: 'Почта для отправки кода подтверждения' })
  @IsEmail()
  @IsNotEmpty()
  buyerEmail: string;
}