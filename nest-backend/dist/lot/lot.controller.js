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
exports.LotController = void 0;
const common_1 = require("@nestjs/common");
const common_2 = require("@nestjs/common");
const lot_service_1 = require("./lot.service");
const lot_dto_1 = require("./dto/lot.dto");
const swagger_1 = require("@nestjs/swagger");
const passport_1 = require("@nestjs/passport");
const current_user_decorator_1 = require("../auth/current-user.decorator");
let LotController = class LotController {
    lotService;
    constructor(lotService) {
        this.lotService = lotService;
    }
    async lot(dto, shopId, accountId) {
        if (!shopId || !accountId) {
            throw new common_2.BadRequestException('Необходимо передать shopId и accountId через заголовки x-shop-id и x-account-id.');
        }
        const createdLot = await this.lotService.createLot(shopId, accountId, dto);
        return createdLot;
    }
    async getAllLots() {
        return this.lotService.getAllLots();
    }
    async getLotById(id) {
        return this.lotService.getLotById(id);
    }
    async getLotsByAccountId(accountId) {
        if (!accountId) {
            throw new common_2.BadRequestException('Необходимо передать accountId в параметрах запроса.');
        }
        return this.lotService.getLotsByAccountId(accountId);
    }
    async deleteOrHideLotById(lotId, user) {
        console.log('ID пользователя из токена (user.id):', user.id);
        return this.lotService.deleteOrHideLotById(lotId, user.id);
    }
};
exports.LotController = LotController;
__decorate([
    (0, common_1.Post)('create'),
    (0, swagger_1.ApiOperation)({ summary: 'Запрос на создание лота' }),
    (0, swagger_1.ApiHeader)({ name: 'x-shop-id', description: 'Уникальный ID магазина', required: true, }),
    (0, swagger_1.ApiHeader)({ name: 'x-account-id', description: 'Уникальный ID аккаунта владельца', required: true, }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Не переданы обязательные заголовки x-shop-id или x-account-id.' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Лот успешно создан!' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Ошибка авторизации (магазин/аккаунт не найден или не является владельцем)' }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Headers)('x-shop-id')),
    __param(2, (0, common_1.Headers)('x-account-id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [lot_dto_1.LotDto, String, String]),
    __metadata("design:returntype", Promise)
], LotController.prototype, "lot", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Получение всех лотов (для каталога)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Список всех лотов успешно получен.' }),
    (0, swagger_1.ApiResponse)({ status: 500, description: 'Внутренняя ошибка сервера.' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], LotController.prototype, "getAllLots", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Получение одного лота по ID' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Уникальный ID лота (UUID)', required: true, type: 'string' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Лот успешно найден.' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Лот с указанным ID не найден.' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Неверный формат ID.' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], LotController.prototype, "getLotById", null);
__decorate([
    (0, common_1.Get)('by-account/:accountId'),
    (0, swagger_1.ApiOperation)({ summary: 'Получение всех лотов конкретного продавца' }),
    (0, swagger_1.ApiParam)({ name: 'accountId', description: 'Уникальный ID аккаунта продавца', required: true }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Список лотов продавца успешно получен.' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Продавец с указанным ID не найден.' }),
    __param(0, (0, common_1.Param)('accountId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], LotController.prototype, "getLotsByAccountId", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.HttpCode)(200),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Удаление одного лота по ID (только владельцем)' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Уникальный ID лота (UUID)', required: true, type: 'string' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Лот успешно удален' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Пользователь не авторизован' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Нет прав для удаления (не владелец)' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Лот с указанным ID не найден' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], LotController.prototype, "deleteOrHideLotById", null);
exports.LotController = LotController = __decorate([
    (0, swagger_1.ApiTags)('Lot'),
    (0, common_1.Controller)('lots'),
    __metadata("design:paramtypes", [lot_service_1.LotService])
], LotController);
//# sourceMappingURL=lot.controller.js.map