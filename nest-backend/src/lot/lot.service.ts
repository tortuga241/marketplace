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
            const lot = await prisma.lot.findMany();
            return lot;
        } catch (error) {
            console.error(error);
            throw new InternalServerErrorException("Не удалось получить полный список лотов");
        }
    };

    //GET запрос на получение конкретного лота
    async getLotById(id: string) {
        const lot = await prisma.lot.findUnique({
            where: { id: id },
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
        //Если аккаунт все таки есть, ищем все его слоты
        try {
            const lots = await prisma.lot.findMany({
                where: {
                    accountId: accountId,
                }
            });
            return lots;
        } catch (error) {
            console.error(error);
            throw new InternalServerErrorException('Не удалось получить список лотов для этого продавца.');
        }
    }

    //DELETE запрос на удаление лота по уникальному ID
    async deleteLotById(lotId: string, accountId: string) {
        try {

            const lot = await prisma.lot.findUnique({
                where: { id: lotId }
            });

            if (!lot) {
                throw new NotFoundException(`Лот с ID "${lotId}" не найден.`);
            }

            // Проверяем, принадлежит ли лот текущему пользователю
            if (lot.accountId !== accountId) {
                console.log(accountId);
                console.log(lot.accountId)
                throw new ForbiddenException('У вас нет прав для удаления этого лота.');
            }

            const deletedLot = await prisma.lot.delete({
                where: { id: lotId }
            });

            console.log('Лот успешно удален', deletedLot);
            return { 
                message: 'Лот успешно удален', 
                id: deletedLot.id,
                title: deletedLot.title
            };

        } catch (error) {
            if (error.code === 'P2025') {
                throw new NotFoundException(`Лот с ID "${lotId}" не найден.`);
            }
            
            console.error("Ошибка при удалении лота:", error);
            throw new InternalServerErrorException('Не удалось удалить лот по ID');
        }
    }
}