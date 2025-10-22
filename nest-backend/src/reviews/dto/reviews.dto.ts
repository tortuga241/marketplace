import { IsNotEmpty } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class ReviewsDto {
    @ApiProperty({ example: 'Качество на высоте, автор реально крут!', description: 'Text-content отзыва' })
    @IsNotEmpty()
    description: string
}