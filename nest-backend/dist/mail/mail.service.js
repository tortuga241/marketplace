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
    async sendOrderConfirmationToBuyer(buyerEmail, orderData, lotSnapshot) {
        const subject = `Ваш заказ #${orderData.code} успешно оформлен!`;
        const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #2c5530;">Спасибо за покупку!</h1>
        <p>Ваш заказ с кодом <strong>${orderData.code}</strong> на сумму <strong>${orderData.cost} ₸</strong> успешно создан.</p>
        
        <div style="background: #f9f9f9; padding: 15px; border-radius: 5px; margin: 20px 0;">
          <h3 style="color: #2c5530; margin-top: 0;">Детали заказа:</h3>
          <p><strong>Код заказа:</strong> ${orderData.code}</p>
          <p><strong>Сумма:</strong> ${orderData.cost} ₸</p>
          <p><strong>Дата:</strong> ${new Date(orderData.createdAt).toLocaleDateString('ru-RU')}</p>
          ${orderData.sellerLogin ? `<p><strong>Продавец:</strong> ${orderData.sellerLogin}</p>` : ''}
        </div>

        <div style="background: #f0f8ff; padding: 15px; border-radius: 5px;">
          <h3 style="color: #2c5530; margin-top: 0;">Информация о товаре:</h3>
          <p><strong>Название:</strong> ${lotSnapshot.title}</p>
          <p><strong>Описание:</strong> ${lotSnapshot.description}</p>
          <p><strong>Тип:</strong> ${lotSnapshot.type}</p>
          <p><strong>Дата создания лота:</strong> ${new Date(lotSnapshot.createdAt).toLocaleDateString('ru-RU')}</p>
        </div>

        <p style="margin-top: 20px; color: #666;">Спасибо, что выбрали нас!</p>
      </div>
    `;
        await this.transporter.sendMail({
            from: `"Ваш Магазин" <${this.configService.get('EMAIL_FROM')}>`,
            to: buyerEmail,
            subject: subject,
            html: html,
        });
    }
    async sendOrderNotificationToSeller(sellerEmail, orderData, lotSnapshot, buyerLogin) {
        const subject = `У вас новая продажа! Заказ #${orderData.code}`;
        const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #2c5530;">Поздравляем с продажей!</h1>
        <p>Ваш лот был куплен. Код заказа: <strong>${orderData.code}</strong>.</p>
        
        <div style="background: #f9f9f9; padding: 15px; border-radius: 5px; margin: 20px 0;">
          <h3 style="color: #2c5530; margin-top: 0;">Детали продажи:</h3>
          <p><strong>Код заказа:</strong> ${orderData.code}</p>
          <p><strong>Сумма продажи:</strong> ${orderData.cost} ₸</p>
          <p><strong>Дата:</strong> ${new Date(orderData.createdAt).toLocaleDateString('ru-RU')}</p>
          ${buyerLogin ? `<p><strong>Покупатель:</strong> ${buyerLogin}</p>` : ''}
        </div>

        <div style="background: #f0f8ff; padding: 15px; border-radius: 5px;">
          <h3 style="color: #2c5530; margin-top: 0;">Информация о проданном лоте:</h3>
          <p><strong>Название:</strong> ${lotSnapshot.title}</p>
          <p><strong>Описание:</strong> ${lotSnapshot.description}</p>
          <p><strong>Тип:</strong> ${lotSnapshot.type}</p>
          <p><strong>Дата создания лота:</strong> ${new Date(lotSnapshot.createdAt).toLocaleDateString('ru-RU')}</p>
        </div>
      </div>
    `;
        await this.transporter.sendMail({
            from: `"Ваш Магазин" <${this.configService.get('EMAIL_FROM')}>`,
            to: sellerEmail,
            subject: subject,
            html: html,
        });
    }
    async sendPurchaseVerificationCode(email, code, lotTitle) {
        const subject = `Подтверждение покупки: ${lotTitle}`;
        const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #2c5530;">Подтвердите вашу покупку</h1>
        <p>Вы собираетесь приобрести лот: <strong>"${lotTitle}"</strong>.</p>
        <p>Ваш 6-значный код подтверждения:</p>
        <div style="text-align: center; margin: 30px 0;">
          <h2 style="font-size: 32px; letter-spacing: 8px; margin: 20px 0; color: #2c5530; font-weight: bold;">${code}</h2>
        </div>
        <p style="color: #d9534f;">Срок действия кода - 10 минут.</p>
        <p style="color: #666;">Если это были не вы, просто проигнорируйте это письмо.</p>
      </div>
    `;
        await this.transporter.sendMail({
            from: `"Ваш Магазин" <${this.configService.get('EMAIL_FROM')}>`,
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