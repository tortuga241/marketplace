import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { ConfigService } from '@nestjs/config'; 
import { Order } from '@prisma/client';

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

  //Письмо об удачной покупки
  async sendOrderConfirmationToBuyer(
    buyerEmail: string,
    order: Order,
    lotSnapshot: any,
  ) {
    const subject = `Ваш заказ #${order.code} успешно оформлен!`;
    const html = `
      <h1>Спасибо за покупку!</h1>
      <p>Ваш заказ с кодом <strong>${order.code}</strong> на сумму ${order.cost} Тг. успешно создан.</p>
      <h3>Детали заказа (Чек):</h3>
      <pre>${JSON.stringify(lotSnapshot, null, 2)}</pre>
      <p>Спасибо, что выбрали нас!</p>
    `;

    await this.transporter.sendMail({
      from: `"Ваш Магазин" <${this.configService.get<string>('EMAIL_FROM')}>`,
      to: buyerEmail,
      subject: subject,
      html: html,
    });
  }

  //Письмо о новой продаже
  async sendOrderNotificationToSeller(
    sellerEmail: string,
    order: Order,
    lotSnapshot: any,
  ) {
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
      from: `"Ваш Магазин" <${this.configService.get<string>('MAIL_FROM')}>`,
      to: sellerEmail,
      subject: subject,
      html: html,
    });
  }

  //6-знаный код подтверждения
  async sendPurchaseVerificationCode(
    email: string,
    code: string,
    lotTitle: string,
  ) {
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
      from: `"Ваш Магазин" <${this.configService.get<string>('MAIL_FROM')}>`,
      to: email,
      subject: subject,
      html: html,
    });
  }
}