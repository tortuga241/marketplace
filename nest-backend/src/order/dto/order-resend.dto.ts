import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';

export class ResendCodeDto {
  @ApiProperty({ description: 'ID записи о верификации (из /initiate)' })
  @IsUUID()
  verificationId: string;
}