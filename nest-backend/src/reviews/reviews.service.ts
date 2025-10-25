import { Injectable, ForbiddenException, BadRequestException, InternalServerErrorException, UnauthorizedException, NotFoundException } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { ReviewsDto } from './dto/reviews.dto';

const prisma = new PrismaClient();

@Injectable()
export class reviewService {

    //POST запрос на создание отзыва
    async createReviews(accountId: string, dto: ReviewsDto) {

        // 1. Проверяем, существует ли пользователь, который оставляет отзыв
        const account = await prisma.account.findUnique({
            where: { id: accountId }
        });

        if (!account) {
            throw new UnauthorizedException('Пользователь не найден');
        }

        // 2. Проверяем, существует ли магазин (продавец), которому оставляют отзыв
        const shop = await prisma.shop.findUnique({
            where: { id: dto.shopId }
        });

        if (!shop) {
            throw new NotFoundException('Магазин не найден');
        }
        
        // 3. Если указан lotId (т.е. это отзыв на лот)
        if (dto.lotId) {
            // 3.1. Проверяем, существует ли такой лот
            const lot = await prisma.lot.findUnique({
                where: { id: dto.lotId }
            });

            if (!lot) {
                throw new NotFoundException('Лот не найден');
            }

            // 3.2. Убедимся, что лот принадлежит указанному магазину
            if (lot.shopId !== dto.shopId) {
                throw new BadRequestException('Этот лот не принадлежит указанному магазину');
            }
        }

        // 4. (Опционально) Проверка, не оставлял ли пользователь уже отзыв
        // Это предотвратит "накрутку"
        const existingReview = await prisma.review.findFirst({
            where: {
                accountId: accountId,
                shopId: dto.shopId,
                lotId: dto.lotId ?? null // Ищем по lotId, если он есть, или ищем отзыв "только на магазин" (где lotId = null)
            }
        });

        if (existingReview) {
            throw new BadRequestException('Вы уже оставляли отзыв на этот товар или магазин');
        }

        // 5. Все проверки пройдены, создаем отзыв
        try {
            const newReview = await prisma.review.create({
                data: {
                    accountId: accountId, 
                    shopId: dto.shopId,     
                    lotId: dto.lotId,       
                    rating: dto.rating,
                    description: dto.description
                }
            });
            return newReview;
        } catch (error) {
            throw new InternalServerErrorException('Не удалось создать отзыв');
        }
    }


    //GET запрос на вывод отзывов в конкретном профиле
    async getReviewsForShop(shopId: string) {

    const shop = await prisma.shop.findUnique({
      where: { id: shopId },
    });

    if (!shop) {
      throw new NotFoundException('Магазин (продавец) не найден');
    }

    return await prisma.review.findMany({
      where: {
        shopId: shopId,
      },
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        account: {
          select: {
            id: true,
            login: true, 
          },
        },
      },
    });
  }


  //GET запрос на получение всех отзывов товара
  async getReviewsForLot(lotId: string) {

    const lot = await prisma.lot.findUnique({
      where: { id: lotId },
    });

    if (!lot) {
      throw new NotFoundException('Лот (товар) не найден');
    }

    return await prisma.review.findMany({
      where: {
        lotId: lotId,
      },
      orderBy: {
        createdAt: 'desc', 
      },
      include: {
        account: {
          select: {
            id: true,
            login: true, 
          },
        },
      },
    });
  }

}