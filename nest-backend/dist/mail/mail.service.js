"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MailService = void 0;
const common_1 = require("@nestjs/common");
const nodemailer = __importStar(require("nodemailer"));
const config_1 = require("@nestjs/config");
let MailService = class MailService {
    configService;
    transporter;
    constructor(configService) {
        this.configService = configService;
        this.transporter = nodemailer.createTransport({
            host: this.configService.get('EMAIL_HOST'),
            port: this.configService.get('EMAIL_PORT'),
            secure: false,
            auth: {
                user: this.configService.get('EMAIL_USER'),
                pass: this.configService.get('EMAIL_PASS'),
            },
        });
    }
    async sendOrderConfirmationToBuyer(buyerEmail, order, lotSnapshot) {
        const subject = `Ваш заказ #${order.code} успешно оформлен!`;
        const html = `
      <h1>Спасибо за покупку!</h1>
      <p>Ваш заказ с кодом <strong>${order.code}</strong> на сумму ${order.cost} Тг. успешно создан.</p>
      <h3>Детали заказа (Чек):</h3>
      <pre>${JSON.stringify(lotSnapshot, null, 2)}</pre>
      <p>Спасибо, что выбрали нас!</p>
    `;
        await this.transporter.sendMail({
            from: `"Ваш Магазин" <${this.configService.get('EMAIL_FROM')}>`,
            to: buyerEmail,
            subject: subject,
            html: html,
        });
    }
    async sendOrderNotificationToSeller(sellerEmail, order, lotSnapshot) {
        const subject = `У вас новая продажа! Заказ #${order.code}`;
        const html = `
      <h1>Поздравляем с продажей!</h1>
      <p>Ваш лот был куплен. Код заказа: <strong>${order.code}</strong>.</p>
      <p>Сумма продажи: ${order.cost} руб.</p>
      <h3>Детали проданного лота (Чек):</h3>
      <pre>${JSON.stringify(lotSnapshot, null, 2)}</pre>
      <p>ID Покупателя: ${order.buyerAccountId}</p>
    `;
        await this.transporter.sendMail({
            from: `"Ваш Магазин" <${this.configService.get('MAIL_FROM')}>`,
            to: sellerEmail,
            subject: subject,
            html: html,
        });
    }
    async sendPurchaseVerificationCode(email, code, lotTitle) {
        const subject = `Подтверждение покупки: ${lotTitle}`;
        const html = `
      <h1>Подтвердите вашу покупку</h1>
      <p>Вы собираетесь приобрести лот: <strong>"${lotTitle}"</strong>.</p>
      <p>Ваш 6-значный код подтверждения:</p>
      <h2 style="font-size: 32px; letter-spacing: 4px; margin: 20px 0;">${code}</h2>
      <p>Срок действия кода - 10 минут.</p>
      <p>Если это были не вы, просто проигнорируйте это письмо.</p>
    `;
        await this.transporter.sendMail({
            from: `"Ваш Магазин" <${this.configService.get('MAIL_FROM')}>`,
            to: email,
            subject: subject,
            html: html,
        });
    }
};
exports.MailService = MailService;
exports.MailService = MailService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], MailService);
//# sourceMappingURL=mail.service.js.map