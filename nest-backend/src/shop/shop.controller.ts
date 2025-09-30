import { Controller, Post, Get, Put, Body, Req, UseGuards } from "@nestjs/common";
import { ShopService } from "./shop.service";
import { OpenShopDto } from "./dto/open-shop.dto";
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { JwtStrategy } from "src/auth/jwt.strategy";

@ApiTags('Shop')
@Controller('shop')
export class ShopController {
    constructor(private readonly shopService: ShopService) {}

  @UseGuards(JwtStrategy)
  @Post('create')
  @ApiOperation({ summary: 'Создать магазин' })
  @ApiResponse({ status: 201, description: 'Магазин создан' })
  createShop(@Req() req, @Body() dto: OpenShopDto) {
    const ownerId = req.user.id; // user.id берется из JWT
    return this.shopService.createShop(ownerId, dto);
  }

  @UseGuards(JwtStrategy)
  @Get('my')
  @ApiOperation({ summary: 'Получить свой магазин' })
  getShop(@Req() req) {
    return this.shopService.getShop(req.user.id);
  }

  @UseGuards(JwtStrategy)
  @Put('update')
  @ApiOperation({ summary: 'Обновить магазин' })
  updateShop(@Req() req, @Body() dto: OpenShopDto) {
    return this.shopService.updateShop(req.user.id, dto);
  }
}