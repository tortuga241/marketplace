import { Controller, Post, Get, Put, Body, Req, UseGuards } from "@nestjs/common";
import { ShopService } from "./shop.service";
import { OpenShopDto } from "./dto/open-shop.dto";
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport'; 

@ApiTags('Shop')
@Controller('shop')
export class ShopController {
    constructor(private readonly shopService: ShopService) {}

  @UseGuards(AuthGuard('jwt'))
  @Post('create')
  @ApiOperation({ summary: 'Создать магазин' })
  @ApiResponse({ status: 201, description: 'Магазин создан' })
  createShop(@Req() req, @Body() dto: OpenShopDto) {
    const ownerId = req.user.id;
    return this.shopService.createShop(ownerId, dto);
  }

  @UseGuards(AuthGuard('jwt')) 
  @Get('my')
  @ApiOperation({ summary: 'Получить свой магазин' })
  getShop(@Req() req) {
    const ownerId = req.user.id;
    return this.shopService.getShop(ownerId);
  }

  @UseGuards(AuthGuard('jwt'))
  @Put('update')
  @ApiOperation({ summary: 'Обновить магазин' })
  updateShop(@Req() req, @Body() dto: OpenShopDto) {
    const ownerId = req.user.id;
    return this.shopService.updateShop(ownerId, dto);
  }
}