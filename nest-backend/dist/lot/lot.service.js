"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LotService = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
let LotService = class LotService {
    async createLot(shopId, accountId, dto) {
        const shop = await prisma.shop.findUnique({
            where: { id: shopId }
        });
        if (!shop) {
            throw new common_1.UnauthorizedException('Магазин с указанным ID не найден.');
        }
        const owner = await prisma.account.findUnique({
            where: { id: accountId }
        });
        if (!owner) {
            throw new common_1.UnauthorizedException('Продавец (аккаунт) не найден.');
        }
        if (shop.ownerId !== accountId) {
            throw new common_1.UnauthorizedException('Указанный аккаунт не является владельцем этого магазина.');
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
        }
        catch (error) {
            console.error(error);
            throw new common_1.InternalServerErrorException('Не удалось создать лот в базе данных.');
        }
    }
    ;
    async getAllLots() {
        try {
            const lot = await prisma.lot.findMany({
                where: { isHidden: false }
            });
            return lot;
        }
        catch (error) {
            console.error(error);
            throw new common_1.InternalServerErrorException("Не удалось получить полный список лотов");
        }
    }
    ;
    async getLotById(id) {
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
            throw new common_1.NotFoundException(`Лот с ID "${id}" не найден.`);
        }
        return lot;
    }
    async getLotsByAccountId(accountId) {
        const owner = await prisma.account.findUnique({
            where: { id: accountId }
        });
        if (!owner) {
            throw new common_1.NotFoundException("Продавец с указанным ID не найден");
        }
        try {
            const lots = await prisma.lot.findMany({
                where: {
                    accountId: accountId,
                    isHidden: false
                }
            });
            return lots;
        }
        catch (error) {
            console.error(error);
            throw new common_1.InternalServerErrorException('Не удалось получить список лотов для этого продавца.');
        }
    }
    async deleteOrHideLotById(lotId, accountId) {
        try {
            const lot = await prisma.lot.findUnique({
                where: { id: lotId },
                include: {
                    _count: {
                        select: { orders: true }
                    }
                }
            });
            if (!lot) {
                throw new common_1.NotFoundException(`Лот с ID "${lotId}" не найден.`);
            }
            if (lot.accountId !== accountId) {
                throw new common_1.ForbiddenException('У вас нет прав для удаления этого лота.');
            }
            if (lot._count.orders > 0) {
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
            }
            else {
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
        }
        catch (error) {
            if (error.code === 'P2025') {
                throw new common_1.NotFoundException(`Лот с ID "${lotId}" не найден.`);
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
            throw new common_1.InternalServerErrorException('Не удалось обработать запрос на удаление лота.');
        }
    }
};
exports.LotService = LotService;
exports.LotService = LotService = __decorate([
    (0, common_1.Injectable)()
], LotService);
//# sourceMappingURL=lot.service.js.map