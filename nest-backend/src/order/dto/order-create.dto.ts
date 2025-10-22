import { IsNotEmpty, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateOrderDto {
  @ApiProperty({ example: 'a1b2c3d4-e5f6-7890-1234-567890abcdef', description: 'ID лота, который хотят купить' })
  @IsUUID()
  @IsNotEmpty()
  lotId: string;
}