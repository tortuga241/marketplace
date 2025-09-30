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
exports.ShopController = void 0;
const common_1 = require("@nestjs/common");
const shop_service_1 = require("./shop.service");
const open_shop_dto_1 = require("./dto/open-shop.dto");
const swagger_1 = require("@nestjs/swagger");
const jwt_strategy_1 = require("../auth/jwt.strategy");
let ShopController = class ShopController {
    shopService;
    constructor(shopService) {
        this.shopService = shopService;
    }
    createShop(req, dto) {
        const ownerId = req.user.id;
        return this.shopService.createShop(ownerId, dto);
    }
    getShop(req) {
        return this.shopService.getShop(req.user.id);
    }
    updateShop(req, dto) {
        return this.shopService.updateShop(req.user.id, dto);
    }
};
exports.ShopController = ShopController;
__decorate([
    (0, common_1.UseGuards)(jwt_strategy_1.JwtStrategy),
    (0, common_1.Post)('create'),
    (0, swagger_1.ApiOperation)({ summary: 'Создать магазин' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Магазин создан' }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, open_shop_dto_1.OpenShopDto]),
    __metadata("design:returntype", void 0)
], ShopController.prototype, "createShop", null);
__decorate([
    (0, common_1.UseGuards)(jwt_strategy_1.JwtStrategy),
    (0, common_1.Get)('my'),
    (0, swagger_1.ApiOperation)({ summary: 'Получить свой магазин' }),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], ShopController.prototype, "getShop", null);
__decorate([
    (0, common_1.UseGuards)(jwt_strategy_1.JwtStrategy),
    (0, common_1.Put)('update'),
    (0, swagger_1.ApiOperation)({ summary: 'Обновить магазин' }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, open_shop_dto_1.OpenShopDto]),
    __metadata("design:returntype", void 0)
], ShopController.prototype, "updateShop", null);
exports.ShopController = ShopController = __decorate([
    (0, swagger_1.ApiTags)('Shop'),
    (0, common_1.Controller)('shop'),
    __metadata("design:paramtypes", [shop_service_1.ShopService])
], ShopController);
//# sourceMappingURL=shop.controller.js.map