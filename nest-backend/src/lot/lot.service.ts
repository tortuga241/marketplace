import { Injectable, ForbiddenException, BadRequestException, InternalServerErrorException, UnauthorizedException, NotFoundException } from '@nestjs/common';
import { Prisma, PrismaClient } from "@prisma/client";

//import file
import { LotDto } from './dto/lot.dto';

const prisma = new PrismaClient();

@Injectable()
export class LotService {

    //POST запрос на создание лота
    async createLot(shopId: string, accountId: string, dto: LotDto) {
        
        const shop = await prisma.shop.findUnique({
            where: { id: shopId }
        });

        if (!shop) {
            throw new UnauthorizedException('Магазин с указанным ID не найден.');
        }
        
        const owner = await prisma.account.findUnique({
            where: { id: accountId }
        });

        if (!owner) {
            throw new UnauthorizedException('Продавец (аккаунт) не найден.');
        }

        if (shop.ownerId !== accountId) {
             throw new UnauthorizedException('Указанный аккаунт не является владельцем этого магазина.');
        }

        try {
            const lot = await prisma.lot.create({
                data: {
                    shopId: shopId, 
                    accountId: accountId, 
                    type: dto.type,
                    title: dto.title,
                    description: dto.description,
                    cost: String(dto.cost), 
                },
            });

            return lot;

        } catch (error) {
            console.error(error);
            throw new InternalServerErrorException('Не удалось создать лот в базе данных.');
        }
    };


    //GET запрос на получение всех лотов (Для каталога)
    async getAllLots() {
        try {
            const lot = await prisma.lot.findMany({
                where: { isHidden: false } 
            });
            return lot;
        } catch (error) {
            console.error(error);
            throw new InternalServerErrorException("Не удалось получить полный список лотов");
        }
    };

    //GET запрос на получение конкретного лота
    async getLotById(id: string) {
        const lot = await prisma.lot.findUnique({
            where: { id: id, isHidden: false },
            include: {
                shop: {         
                    include: {
                        owner: { 
                            select: {
                                login: true 
                            }
                        }
                    }
                }
            }
        });
        
        if (!lot) {
            throw new NotFoundException(`Лот с ID "${id}" не найден.`);
        }

        return lot;
    }

    //GET запрос на получение лотов конкретного продавца
    async getLotsByAccountId( accountId: string ) {

        const owner = await prisma.account.findUnique({
            where: { id: accountId }
        });

        if(!owner) {
            throw new NotFoundException("Продавец с указанным ID не найден")
        }

        try {
            const lots = await prisma.lot.findMany({
                where: {
                    accountId: accountId,
                    isHidden: false 
                }
            });
            return lots;
        } catch (error) {
            console.error(error);
            throw new InternalServerErrorException('Не удалось получить список лотов для этого продавца.');
        }
    }

    //DELETE запрос на удаление или скрытие лота по уникальному ID
     async deleteOrHideLotById(lotId: string, accountId: string) {
        try {
            //Находим лот и проверяем
            const lot = await prisma.lot.findUnique({
                where: { id: lotId },
                include: {
                    _count: { 
                        select: { orders: true }
                    }
                }
            });

            if (!lot) {
                throw new NotFoundException(`Лот с ID "${lotId}" не найден.`);
            }

            if (lot.accountId !== accountId) {
                throw new ForbiddenException('У вас нет прав для удаления этого лота.');
            }

            // 3. ГЛАВНАЯ ЛОГИКА
            if (lot._count.orders > 0) {
                //Скрываем
                const hiddenLot = await prisma.lot.update({
                    where: { id: lotId },
                    data: { isHidden: true }
                });

                console.log('Лот успешно скрыт (т.к. есть заказы)', hiddenLot);
                return { 
                    message: 'Лот успешно скрыт (так как он используется в заказах)',
                    id: hiddenLot.id,
                    status: 'hidden'
                };

            } else {
                //Удаляем
                const deletedLot = await prisma.lot.delete({
                    where: { id: lotId }
                });

                console.log('Лот успешно удален (заказов нет)', deletedLot);
                return { 
                    message: 'Лот успешно удален', 
                    id: deletedLot.id,
                    status: 'deleted'
                };
            }

        } catch (error) {
            if (error.code === 'P2025') {
                throw new NotFoundException(`Лот с ID "${lotId}" не найден.`);
            }
            if (error.code === 'P2003') {
                 console.warn(`Попытка удалить лот ${lotId}, у которого есть заказы (проверка _count не удалась?). Принудительное скрытие.`);
                 const hiddenLot = await prisma.lot.update({
                    where: { id: lotId },
                    data: { isHidden: true }
                });
                return { 
                    message: 'Лот успешно скрыт (связан с заказом)',
                    id: hiddenLot.id,
                    status: 'hidden'
                };
            }
            
            console.error("Ошибка при удалении/скрытии лота:", error);
            throw new InternalServerErrorException('Не удалось обработать запрос на удаление лота.');
        }
    }
}