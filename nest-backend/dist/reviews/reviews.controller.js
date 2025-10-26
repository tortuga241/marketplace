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
exports.ReviewController = void 0;
const common_1 = require("@nestjs/common");
const reviews_service_1 = require("./reviews.service");
const reviews_dto_1 = require("./dto/reviews.dto");
const passport_1 = require("@nestjs/passport");
const swagger_1 = require("@nestjs/swagger");
let ReviewController = class ReviewController {
    reviewService;
    constructor(reviewService) {
        this.reviewService = reviewService;
    }
    async createReview(req, dto) {
        const accountId = req.user.id;
        console.log("AccountID: ", accountId);
        if (!accountId) {
            throw new common_1.UnauthorizedException('Не удалось определить ID пользователя из токена');
        }
        return this.reviewService.createReviews(accountId, dto);
    }
    async getReviewsForShop(shopId) {
        return this.reviewService.getReviewsForShop(shopId);
    }
    async getReviewsForLot(lotId) {
        return this.reviewService.getReviewsForLot(lotId);
    }
    async deleteReview(req, reviewId) {
        const accountId = req.user.id;
        if (!accountId) {
            throw new common_1.UnauthorizedException('Не удалось определить ID пользователя из токена');
        }
        return this.reviewService.deleteReview(reviewId, accountId);
    }
};
exports.ReviewController = ReviewController;
__decorate([
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Создать новый отзыв' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Отзыв успешно создан.' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Неверный запрос (напр., отзыв уже существует).' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Пользователь не авторизован.' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Магазин или лот не найден.' }),
    (0, swagger_1.ApiResponse)({ status: 500, description: 'Внутренняя ошибка сервера.' }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, reviews_dto_1.ReviewsDto]),
    __metadata("design:returntype", Promise)
], ReviewController.prototype, "createReview", null);
__decorate([
    (0, common_1.Get)('shop/:shopId'),
    (0, swagger_1.ApiOperation)({ summary: 'Получить все отзывы для магазина (продавца)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Список отзывов успешно получен.' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Магазин не найден.' }),
    __param(0, (0, common_1.Param)('shopId', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ReviewController.prototype, "getReviewsForShop", null);
__decorate([
    (0, common_1.Get)('lot/:lotId'),
    (0, swagger_1.ApiOperation)({ summary: 'Получить все отзывы для конкретного товара (лота)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Список отзывов успешно получен.' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Лот не найден.' }),
    __param(0, (0, common_1.Param)('lotId', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ReviewController.prototype, "getReviewsForLot", null);
__decorate([
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    (0, common_1.Delete)(':reviewId'),
    (0, common_1.HttpCode)(204),
    (0, swagger_1.ApiOperation)({ summary: 'Удалить отзыв' }),
    (0, swagger_1.ApiResponse)({ status: 204, description: 'Отзыв успешно удален.' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Пользователь не авторизован.' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'У пользователя нет прав на удаление этого отзыва.' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Отзыв не найден.' }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('reviewId', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], ReviewController.prototype, "deleteReview", null);
exports.ReviewController = ReviewController = __decorate([
    (0, swagger_1.ApiTags)('Reviews (Отзывы)'),
    (0, common_1.Controller)('reviews'),
    __metadata("design:paramtypes", [reviews_service_1.reviewService])
], ReviewController);
//# sourceMappingURL=reviews.controller.js.map