import { ApiProperty } from "@nestjs/swagger";

export class OpenShopDto {
    @ApiProperty({ example: 'DocsShop', description: 'Название магазина' })
    title: string

    @ApiProperty({ example: 'Docs', description: 'Тип магазина' })
    type: string

    @ApiProperty({ example: 'The best shop', description: 'Описание магазина' })
    description: string

    @ApiProperty({example: '+ 777 333 68 07', description: 'Номер телефона продавца'})
    phone: string
}