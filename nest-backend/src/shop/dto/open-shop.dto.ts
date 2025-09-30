import { ApiProperty } from "@nestjs/swagger";

export class OpenShopDto {
    @ApiProperty({ example: 'DocsShop', description: 'Название магазина' })
    title: string

    @ApiProperty({ example: 'Docs', description: 'Тип магазина' })
    type: string

    @ApiProperty({ example: 'The best shop', description: 'Описание магазина' })
    discription: string
}