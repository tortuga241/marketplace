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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrdersController = void 0;
const common_1 = require("@nestjs/common");
const order_service_1 = require("./order.service");
const order_create_dto_1 = require("./dto/order-create.dto");
const order_complete_dto_1 = require("./dto/order-complete.dto");
const order_resend_dto_1 = require("./dto/order-resend.dto");
const swagger_1 = require("@nestjs/swagger");
const passport_1 = require("@nestjs/passport");
const current_user_decorator_1 = require("../auth/current-user.decorator");
let OrdersController = class OrdersController {
    ordersService;
    constructor(ordersService) {
        this.ordersService = ordersService;
    }
    initiate(createOrderDto, req, buyerAccountId) {
        return this.ordersService.initiatePurchase(createOrderDto, buyerAccountId);
    }
    complete(completeOrderDto, req) {
        const buyerAccountId = req.user.id;
        return this.ordersService.completePurchase(completeOrderDto, buyerAccountId);
    }
    resend(resendCodeDto, req) {
        return this.ordersService.resendVerificationCode(resendCodeDto, req.user.id);
    }
    findMyPurchases(buyerId) {
        console.log('Current user ID:', buyerId);
        return this.ordersService.findAllByBuyer(buyerId);
    }
    findMySales(sellerId) {
        return this.ordersService.findAllBySeller(sellerId);
    }
    async findOne(id, req) {
        const order = await this.ordersService.findOne(id);
        if (order.buyerAccountId !== req.user.id &&
            order.sellerAccountId !== req.user.id) {
            throw new common_1.ForbiddenException('У вас нет доступа к этому заказу');
        }
        return order;
    }
};
exports.OrdersController = OrdersController;
__decorate([
    (0, common_1.Post)('initiate'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: '1. Инициировать покупку (отправить код на почту)' }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __param(2, (0, current_user_decorator_1.CurrentUser)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [order_create_dto_1.CreateOrderDto, Object, String]),
    __metadata("design:returntype", void 0)
], OrdersController.prototype, "initiate", null);
__decorate([
    (0, common_1.Post)('complete'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: '2. Завершить покупку (проверить код и создать заказ)' }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [order_complete_dto_1.CompleteOrderDto, Object]),
    __metadata("design:returntype", void 0)
], OrdersController.prototype, "complete", null);
__decorate([
    (0, common_1.Post)('resend'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: '3. Отправить код верификации повторно' }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [order_resend_dto_1.ResendCodeDto, Object]),
    __metadata("design:returntype", void 0)
], OrdersController.prototype, "resend", null);
__decorate([
    (0, common_1.Get)('my-purchases'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Получить МОИ покупки (безопасно)' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], OrdersController.prototype, "findMyPurchases", null);
__decorate([
    (0, common_1.Get)('my-sales'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Получить МОИ продажи (безопасно)' }),
    (0, swagger_1.ApiOperation)({ summary: 'Получить МОИ продажи (безопасно)' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], OrdersController.prototype, "findMySales", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Получить один заказ по ID' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'UUID Заказа' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], OrdersController.prototype, "findOne", null);
exports.OrdersController = OrdersController = __decorate([
    (0, swagger_1.ApiTags)('orders'),
    (0, common_1.Controller)('orders'),
    __metadata("design:paramtypes", [order_service_1.OrdersService])
], OrdersController);
//# sourceMappingURL=order.controller.js.map