import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from 'class-validator';


export class LotDto {
    @ApiProperty({ example: 'Курс по WEB разработке', description: 'Название продукта' })
    @IsNotEmpty()
    title: string;

    @ApiProperty({ example: '20.000₸', description: 'Стоимость продукта'})
    @IsNotEmpty()
    cost: string

    @ApiProperty({ example: 'Видео', description: 'Тип продукта' })
    @IsNotEmpty()
    type: string

    @ApiProperty({ example: 'Углубленный курс по WEB разработке', description: 'Описание продукта' })
    @IsNotEmpty()
    description: string
}