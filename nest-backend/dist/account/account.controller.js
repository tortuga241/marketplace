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
exports.UserController = void 0;
const common_1 = require("@nestjs/common");
const account_service_1 = require("./account.service");
const create_account_request_dto_1 = require("./dto/create-account-request.dto");
const create_account_verify_dto_1 = require("./dto/create-account-verify.dto");
let UserController = class UserController {
    userService;
    constructor(userService) {
        this.userService = userService;
    }
    requestRegister(dto) {
        return this.userService.requestRegister(dto);
    }
    ;
    verifyRegister(dto) {
        return this.userService.verifyRegister(dto);
    }
    ;
};
exports.UserController = UserController;
__decorate([
    (0, common_1.Post)('request-register'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_account_request_dto_1.RequestRegisterDto]),
    __metadata("design:returntype", void 0)
], UserController.prototype, "requestRegister", null);
__decorate([
    (0, common_1.Post)('verify-register'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_account_verify_dto_1.VerifyRegisterDto]),
    __metadata("design:returntype", void 0)
], UserController.prototype, "verifyRegister", null);
exports.UserController = UserController = __decorate([
    (0, common_1.Controller)('user'),
    __metadata("design:paramtypes", [account_service_1.UserService])
], UserController);
;
//# sourceMappingURL=account.controller.js.map