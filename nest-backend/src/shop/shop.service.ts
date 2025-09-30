import { Injectable, BadRequestException } from '@nestjs/common';
// import { PrismaClient } from '../../app/generated/prisma';
import { PrismaClient } from '@prisma/client';
import { OpenShopDto } from './dto/open-shop.dto';

const prisma = new PrismaClient();

@Injectable()
export class ShopService {
  async createShop(ownerId: string, dto: OpenShopDto) {

    //Проверка на заполненость полей
    if (!dto.type || !dto.title || !dto.discription) {
      throw new BadRequestException('Все поля обязательны');
    }

    //Проверка на наличие магазина у пользователя 
    const existing = await prisma.shop.findUnique({ where: { ownerId } });
    if (existing) throw new BadRequestException('У вас уже есть магазин');

    //Создаём магазин
    const shop = await prisma.shop.create({
      data: {
        ownerId,
        type: dto.type,
        title: dto.title,
        discription: dto.discription,
      },
    });

    return shop;
  }

  async getShop(ownerId: string) {
    return prisma.shop.findUnique({ where: { ownerId } });
  }

  async updateShop(ownerId: string, dto: OpenShopDto) {
    if (!dto.type || !dto.title || !dto.discription) {
      throw new BadRequestException('Все поля обязательны');
    }

    const shop = await prisma.shop.findUnique({ where: { ownerId } });
    if (!shop) throw new BadRequestException('Магазин не найден');

    return prisma.shop.update({
      where: { ownerId },
      data: {
        type: dto.type,
        title: dto.title,
        discription: dto.discription,
      },
    });
  }
}
