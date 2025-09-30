"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ShopService = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
let ShopService = class ShopService {
    async createShop(ownerId, dto) {
        if (!dto.type || !dto.title || !dto.discription) {
            throw new common_1.BadRequestException('Все поля обязательны');
        }
        const existing = await prisma.shop.findUnique({ where: { ownerId } });
        if (existing)
            throw new common_1.BadRequestException('У вас уже есть магазин');
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
    async getShop(ownerId) {
        return prisma.shop.findUnique({ where: { ownerId } });
    }
    async updateShop(ownerId, dto) {
        if (!dto.type || !dto.title || !dto.discription) {
            throw new common_1.BadRequestException('Все поля обязательны');
        }
        const shop = await prisma.shop.findUnique({ where: { ownerId } });
        if (!shop)
            throw new common_1.BadRequestException('Магазин не найден');
        return prisma.shop.update({
            where: { ownerId },
            data: {
                type: dto.type,
                title: dto.title,
                discription: dto.discription,
            },
        });
    }
};
exports.ShopService = ShopService;
exports.ShopService = ShopService = __decorate([
    (0, common_1.Injectable)()
], ShopService);
//# sourceMappingURL=shop.service.js.map