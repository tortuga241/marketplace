import { IsNotEmpty, Max, Min, IsString, IsOptional } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class ReviewsDto {
    @ApiProperty({ example: 'Качество на высоте, автор реально крут!', description: 'Text-content отзыва' })
    @IsNotEmpty()
    description: string;

    @ApiProperty({ example: '5', description: 'Рейтинг от 1 до 5' })
    @IsNotEmpty()
    @Min(1)
    @Max(5)
    rating: number;

    @ApiProperty({ example: 'uuid-shop-123', description: 'ID магазина (продавца), к которому отзыв' })
    @IsNotEmpty()
    @IsString() 
    shopId: string;

    @ApiProperty({ example: 'uuid-lot-456', description: 'ID лота (если отзыв о лоте)', required: false })
    @IsOptional()
    @IsString() 
    lotId?: string;
}