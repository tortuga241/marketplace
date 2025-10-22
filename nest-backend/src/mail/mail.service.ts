import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { ConfigService } from '@nestjs/config'; 
import { Order } from '@prisma/client';

// Исправленные интерфейсы
export interface MinimalLotSnapshot {
  title: string;
  description: string;
  type: string;
  createdAt: string;
}

export interface OrderReceiptData {
  code: string;
  cost: number;
  createdAt: Date;
  sellerLogin?: string;
  lotTitle?: string;
}

@Injectable()
export class MailService {
  private transporter: nodemailer.Transporter;

  constructor(private configService: ConfigService) {
    this.transporter = nodemailer.createTransport({
      host: this.configService.get<string>('EMAIL_HOST'),
      port: this.configService.get<number>('EMAIL_PORT'), 
      secure: false, 
      auth: {
        user: this.configService.get<string>('EMAIL_USER'),
        pass: this.configService.get<string>('EMAIL_PASS'),
      },
    });
  }

  // Письмо покупателю - исправленная версия
  async sendOrderConfirmationToBuyer(
    buyerEmail: string,
    orderData: OrderReceiptData,
    lotSnapshot: MinimalLotSnapshot,
  ) {
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
      from: `"Ваш Магазин" <${this.configService.get<string>('EMAIL_FROM')}>`,
      to: buyerEmail,
      subject: subject,
      html: html,
    });
  }

  // Письмо продавцу - исправленная версия
  async sendOrderNotificationToSeller(
    sellerEmail: string,
    orderData: OrderReceiptData,
    lotSnapshot: MinimalLotSnapshot,
    buyerLogin?: string
  ) {
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
      from: `"Ваш Магазин" <${this.configService.get<string>('EMAIL_FROM')}>`,
      to: sellerEmail,
      subject: subject,
      html: html,
    });
  }

  // 6-значный код подтверждения (без изменений)
  async sendPurchaseVerificationCode(
    email: string,
    code: string,
    lotTitle: string,
  ) {
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
      from: `"Ваш Магазин" <${this.configService.get<string>('EMAIL_FROM')}>`,
      to: email,
      subject: subject,
      html: html,
    });
  }
}