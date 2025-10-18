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
exports.LotDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class LotDto {
    title;
    cost;
    type;
    description;
}
exports.LotDto = LotDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Курс по WEB разработке', description: 'Название продукта' }),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], LotDto.prototype, "title", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '20.000₸', description: 'Стоимость продукта' }),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], LotDto.prototype, "cost", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Видео', description: 'Тип продукта' }),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], LotDto.prototype, "type", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Углубленный курс по WEB разработке', description: 'Описание продукта' }),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], LotDto.prototype, "description", void 0);
//# sourceMappingURL=lot.dto.js.map