"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.reviewService = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
let reviewService = class reviewService {
    async createReviews(accountId, dto) {
        const account = await prisma.account.findUnique({
            where: { id: accountId }
        });
        if (!account) {
            throw new common_1.UnauthorizedException('Пользователь не найден');
        }
        const shop = await prisma.shop.findUnique({
            where: { id: dto.shopId }
        });
        if (!shop) {
            throw new common_1.NotFoundException('Магазин не найден');
        }
        if (dto.lotId) {
            const lot = await prisma.lot.findUnique({
                where: { id: dto.lotId }
            });
            if (!lot) {
                throw new common_1.NotFoundException('Лот не найден');
            }
            if (lot.shopId !== dto.shopId) {
                throw new common_1.BadRequestException('Этот лот не принадлежит указанному магазину');
            }
        }
        const existingReview = await prisma.review.findFirst({
            where: {
                accountId: accountId,
                shopId: dto.shopId,
                lotId: dto.lotId ?? null
            }
        });
        if (existingReview) {
            throw new common_1.BadRequestException('Вы уже оставляли отзыв на этот товар или магазин');
        }
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
        }
        catch (error) {
            throw new common_1.InternalServerErrorException('Не удалось создать отзыв');
        }
    }
    async getReviewsForShop(shopId) {
        const shop = await prisma.shop.findUnique({
            where: { id: shopId },
        });
        if (!shop) {
            throw new common_1.NotFoundException('Магазин (продавец) не найден');
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
    async getReviewsForLot(lotId) {
        const lot = await prisma.lot.findUnique({
            where: { id: lotId },
        });
        if (!lot) {
            throw new common_1.NotFoundException('Лот (товар) не найден');
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
};
exports.reviewService = reviewService;
exports.reviewService = reviewService = __decorate([
    (0, common_1.Injectable)()
], reviewService);
//# sourceMappingURL=reviews.service.js.map