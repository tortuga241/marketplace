"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrdersService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const mail_service_1 = require("../mail/mail.service");
const crypto_1 = require("crypto");
const client_1 = require("@prisma/client");
let OrdersService = class OrdersService {
    prisma;
    mailService;
    constructor(prisma, mailService) {
        this.prisma = prisma;
        this.mailService = mailService;
    }
    generateVerificationCode() {
        return Math.floor(100000 + Math.random() * 900000).toString();
    }
    async initiatePurchase(createOrderDto, buyerAccountId) {
        const lot = await this.prisma.lot.findUnique({
            where: { id: createOrderDto.lotId },
            include: { shop: { select: { owner: true } } },
        });
        if (!lot) {
            throw new common_1.NotFoundException('Лот не найден');
        }
        const { accountId: sellerAccountId, shopId, cost, ...lotDetails } = lot;
        if (sellerAccountId === buyerAccountId) {
            throw new common_1.ForbiddenException('Вы не можете купить свой собственный лот');
        }
        const buyer = await this.prisma.account.findUnique({
            where: { id: buyerAccountId },
            select: { email: true, isVerified: true },
        });
        if (!buyer) {
            throw new common_1.NotFoundException('Покупатель не найден');
        }
        if (!buyer.isVerified) {
            throw new common_1.ForbiddenException('Подтвердите свой email для совершения покупок');
        }
        await this.prisma.orderVerification.deleteMany({
            where: {
                lotId: lot.id,
                buyerAccountId: buyerAccountId,
            },
        });
        const code = this.generateVerificationCode();
        const expiresAt = new Date(Date.now() + 10 * 60 * 1000);
        const minimalLotSnapshot = {
            title: lot.title,
            description: lot.description,
            type: lot.type,
            createdAt: lot.createdAt.toISOString()
        };
        const verification = await this.prisma.orderVerification.create({
            data: {
                verificationCode: code,
                expiresAt: expiresAt,
                lotId: lot.id,
                sellerAccountId: sellerAccountId,
                shopId: shopId,
                buyerAccountId: buyerAccountId,
                lotSnapshot: minimalLotSnapshot,
                cost: parseFloat(cost),
                status: 'PENDING',
                buyerEmail: buyer.email,
            },
        });
        await this.mailService
            .sendPurchaseVerificationCode(buyer.email, code, lot.title)
            .catch((err) => {
            console.error('Ошибка отправки verification code:', err);
        });
        return {
            message: 'Код подтверждения отправлен на вашу почту',
            verificationId: verification.id,
            expiresAt: verification.expiresAt,
            buyerEmail: verification.buyerEmail,
        };
    }
    async completePurchase(completeOrderDto, buyerAccountId) {
        const { verificationId, code } = completeOrderDto;
        const verification = await this.prisma.orderVerification.findUnique({
            where: { id: verificationId },
        });
        if (!verification) {
            throw new common_1.NotFoundException('Сессия покупки не найдена.');
        }
        if (verification.buyerAccountId !== buyerAccountId) {
            throw new common_1.ForbiddenException('Вы не можете подтвердить чужую покупку.');
        }
        if (verification.expiresAt < new Date()) {
            await this.prisma.orderVerification.delete({ where: { id: verificationId } });
            throw new common_1.BadRequestException('Срок действия кода истек. Начните заново.');
        }
        if (verification.verificationCode !== code) {
            throw new common_1.BadRequestException('Неверный код подтверждения.');
        }
        const seller = await this.prisma.account.findUnique({
            where: { id: verification.sellerAccountId },
            select: { email: true, login: true },
        });
        if (!seller) {
            throw new common_1.InternalServerErrorException('Продавец лота не найден.');
        }
        const buyer = await this.prisma.account.findUnique({
            where: { id: buyerAccountId },
            select: { login: true },
        });
        const orderCode = (0, crypto_1.randomBytes)(4).toString('hex').toUpperCase();
        try {
            const newOrder = await this.prisma.order.create({
                data: {
                    code: orderCode,
                    lotId: verification.lotId,
                    lotSnapshot: verification.lotSnapshot === null ? client_1.Prisma.JsonNull : verification.lotSnapshot,
                    sellerAccountId: verification.sellerAccountId,
                    shopId: verification.shopId,
                    buyerAccountId: verification.buyerAccountId,
                    cost: verification.cost,
                    status: 'COMPLETED',
                },
            });
            const orderDataForEmail = {
                code: newOrder.code,
                cost: newOrder.cost,
                createdAt: newOrder.createdAt,
                sellerLogin: seller.login
            };
            const lotSnapshot = this.parseLotSnapshot(verification.lotSnapshot);
            this.mailService
                .sendOrderConfirmationToBuyer(verification.buyerEmail, orderDataForEmail, lotSnapshot)
                .catch((err) => console.error('Ошибка отправки письма покупателю:', err));
            this.mailService
                .sendOrderNotificationToSeller(seller.email, orderDataForEmail, lotSnapshot, buyer?.login)
                .catch((err) => console.error('Ошибка отправки письма продавцу:', err));
            await this.prisma.orderVerification.delete({ where: { id: verificationId } });
            return newOrder;
        }
        catch (error) {
            if (error instanceof client_1.Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
                throw new common_1.ForbiddenException('Ошибка создания заказа. Попробуйте снова.');
            }
            throw new common_1.InternalServerErrorException('Не удалось создать заказ');
        }
    }
    parseLotSnapshot(lotSnapshot) {
        if (!lotSnapshot || typeof lotSnapshot !== 'object' || Array.isArray(lotSnapshot)) {
            throw new Error('Invalid lot snapshot data');
        }
        const snapshot = lotSnapshot;
        return {
            title: String(snapshot.title || ''),
            description: String(snapshot.description || ''),
            type: String(snapshot.type || ''),
            createdAt: String(snapshot.createdAt || '')
        };
    }
    async resendVerificationCode(resendCodeDto, buyerAccountId) {
        const verification = await this.prisma.orderVerification.findUnique({
            where: { id: resendCodeDto.verificationId },
        });
        if (!verification) {
            throw new common_1.NotFoundException('Сессия покупки не найдена.');
        }
        if (verification.buyerAccountId !== buyerAccountId) {
            throw new common_1.ForbiddenException('Нет доступа.');
        }
        const lot = await this.prisma.lot.findUnique({
            where: { id: verification.lotId },
            select: { title: true }
        });
        if (!lot) {
            await this.prisma.orderVerification.delete({ where: { id: verification.id } });
            throw new common_1.NotFoundException('Связанный лот больше не существует.');
        }
        const newCode = this.generateVerificationCode();
        const newExpiresAt = new Date(Date.now() + 10 * 60 * 1000);
        await this.prisma.orderVerification.update({
            where: { id: verification.id },
            data: {
                verificationCode: newCode,
                expiresAt: newExpiresAt,
            },
        });
        await this.mailService.sendPurchaseVerificationCode(verification.buyerEmail, newCode, lot.title);
        return {
            message: 'Код отправлен повторно',
            expiresAt: newExpiresAt
        };
    }
    async findOne(id) {
        const order = await this.prisma.order.findUnique({
            where: { id },
            include: {
                lot: { select: { title: true } },
                shop: { select: { title: true } },
                buyer: { select: { login: true } },
                seller: { select: { login: true } },
            },
        });
        if (!order) {
            throw new common_1.NotFoundException('Заказ не найден');
        }
        return order;
    }
    async findAllBySeller(sellerId) {
        return this.prisma.order.findMany({
            where: { sellerAccountId: sellerId },
            include: {
                lot: { select: { title: true } },
                buyer: { select: { login: true } },
            },
            orderBy: {
                createdAt: 'desc',
            },
        });
    }
    async findAllByBuyer(buyerId) {
        return this.prisma.order.findMany({
            where: { buyerAccountId: buyerId },
            include: {
                lot: { select: { title: true } },
                seller: { select: { login: true } },
            },
            orderBy: {
                createdAt: 'desc',
            },
        });
    }
};
exports.OrdersService = OrdersService;
exports.OrdersService = OrdersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService, mail_service_1.MailService])
], OrdersService);
//# sourceMappingURL=order.service.js.map