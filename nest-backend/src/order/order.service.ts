import { Injectable, NotFoundException, ForbiddenException, InternalServerErrorException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { MailService } from '../mail/mail.service';
import { CreateOrderDto } from './dto/order-create.dto';
import { CompleteOrderDto } from './dto/order-complete.dto';
import { ResendCodeDto } from './dto/order-resend.dto';
import { randomBytes } from 'crypto';
import { Prisma } from '@prisma/client';

@Injectable()
export class OrdersService { constructor( private prisma: PrismaService, private mailService: MailService,) {}

  //Генерация 6-значного кода
  private generateVerificationCode(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  //POST /initiate
  async initiatePurchase(
    createOrderDto: CreateOrderDto,
    buyerAccountId: string,
  ) {
    const lot = await this.prisma.lot.findUnique({
      where: { id: createOrderDto.lotId },
      include: { shop: { select: { owner: true } } },
    });

    if (!lot) {
      throw new NotFoundException('Лот не найден');
    }

    const { accountId: sellerAccountId, shopId, cost, ...lotDetails } = lot;

    if (sellerAccountId === buyerAccountId) {
      throw new ForbiddenException('Вы не можете купить свой собственный лот');
    }

    const buyer = await this.prisma.account.findUnique({
      where: { id: buyerAccountId },
      select: { email: true, isVerified: true },
    });

    if (!buyer) {
      throw new NotFoundException('Покупатель не найден');
    }
    if (!buyer.isVerified) {
      throw new ForbiddenException('Подтвердите свой email для совершения покупок');
    }

    //Удаляем старые/незавершенные попытки покупки этого лота этим юзером
    await this.prisma.orderVerification.deleteMany({
      where: {
        lotId: lot.id,
        buyerAccountId: buyerAccountId,
      },
    });

    //Создаем запись для верификации
    const code = this.generateVerificationCode();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 минут
    const lotSnapshot = lotDetails;

    //Сохраняем только необходимые данные для чека
    const minimalLotSnapshot = {
      title: lot.title,
      description: lot.description,
      type: lot.type,
      createdAt: lot.createdAt
    };

    const verification = await this.prisma.orderVerification.create({
      data: {
        verificationCode: code,
        expiresAt: expiresAt,
        lotId: lot.id,
        sellerAccountId: sellerAccountId,
        shopId: shopId,
        buyerAccountId: buyerAccountId,
        lotSnapshot:  minimalLotSnapshot,
        cost: parseFloat(cost),
        status: 'PENDING',
        buyerEmail: buyer.email,
      },
    });

    //Отправляем код на почту
    await this.mailService
      .sendPurchaseVerificationCode(buyer.email, code, lot.title)
      .catch((err) => {
        console.error('Ошибка отправки verification code:', err);
      });

    return {
      message: 'Код подтверждения отправлен на вашу почту',
      verificationId: verification.id,
      expiresAt: verification.expiresAt,
      buyerEmail: verification.buyerEmail,
    };
  }

  //POST /complete 
  async completePurchase(
    completeOrderDto: CompleteOrderDto,
    buyerAccountId: string,
  ) {
    const { verificationId, code } = completeOrderDto;

    const verification = await this.prisma.orderVerification.findUnique({
      where: { id: verificationId },
    });

    if (!verification) {
      throw new NotFoundException('Сессия покупки не найдена.');
    }
    if (verification.buyerAccountId !== buyerAccountId) {
      throw new ForbiddenException('Вы не можете подтвердить чужую покупку.');
    }
    if (verification.expiresAt < new Date()) {
      await this.prisma.orderVerification.delete({ where: { id: verificationId }});
      throw new BadRequestException('Срок действия кода истек. Начните заново.');
    }
    if (verification.verificationCode !== code) {
      throw new BadRequestException('Неверный код подтверждения.');
    }

    const seller = await this.prisma.account.findUnique({
      where: { id: verification.sellerAccountId },
      select: { email: true, login: true },
    });

    if (!seller) {
      throw new InternalServerErrorException('Продавец лота не найден.');
    }

    const orderCode = randomBytes(4).toString('hex').toUpperCase();

    try {
      const newOrder = await this.prisma.order.create({
        data: {
          code: orderCode,
          lotId: verification.lotId,
          lotSnapshot: verification.lotSnapshot === null ? Prisma.JsonNull : (verification.lotSnapshot as Prisma.InputJsonValue),
          sellerAccountId: verification.sellerAccountId,
          shopId: verification.shopId,
          buyerAccountId: verification.buyerAccountId,
          cost: verification.cost,
          status: 'COMPLETED',
        },
      });

      //Создаем минимизированные данные для чека
      const minimalOrderDataSeller = {
        code: newOrder.code,
        cost: newOrder.cost,
        createdAt: newOrder.createdAt,
        sellerLogin: seller.login
      };

      //Отправляем чеки
      this.mailService
        .sendOrderConfirmationToBuyer(
          verification.buyerEmail,
          newOrder,
          verification.lotSnapshot,
        )
        .catch((err) => console.error('Ошибка отправки письма покупателю:', err));

      this.mailService
        .sendOrderNotificationToSeller(
          seller.email,
          newOrder,
          verification.lotSnapshot,
        )
        .catch((err) => console.error('Ошибка отправки письма продавцу:', err));

      //Удаляем временную запись верификации
      await this.prisma.orderVerification.delete({ where: { id: verificationId }});

      return newOrder;

    } catch (error) {
      if (error.code === 'P2002') {
        throw new ForbiddenException('Ошибка создания заказа. Попробуйте снова.');
      }
      throw new InternalServerErrorException('Не удалось создать заказ');
    }
  }

  //POST /resend 
  async resendVerificationCode(
    resendCodeDto: ResendCodeDto,
    buyerAccountId: string,
  ) {
    const verification = await this.prisma.orderVerification.findUnique({
      where: { id: resendCodeDto.verificationId },
      // include: { lot: { select: { title: true } } } может позже восставнлю
    });
    
    if (!verification) {
      throw new NotFoundException('Сессия покупки не найдена.');
    }
    if (verification.buyerAccountId !== buyerAccountId) {
      throw new ForbiddenException('Нет доступа.');
    }

    const lot = await this.prisma.lot.findUnique({
      where: { id: verification.lotId },
      select: { title: true }
    });

    if (!lot) {
      await this.prisma.orderVerification.delete({ where: { id: verification.id }});
      throw new NotFoundException('Связанный лот больше не существует.');
    }

    const newCode = this.generateVerificationCode();
    const newExpiresAt = new Date(Date.now() + 10 * 60 * 1000); // +10 минут

    await this.prisma.orderVerification.update({
      where: { id: verification.id },
      data: {
        verificationCode: newCode,
        expiresAt: newExpiresAt,
      },
    });

    await this.mailService.sendPurchaseVerificationCode(
      verification.buyerEmail,
      newCode,
      lot.title,
    );

    return { 
      message: 'Код отправлен повторно',
      expiresAt: newExpiresAt 
    };
  }

  //GET запрос на получение заказа по ID
  async findOne(id: string) {
    const order = await this.prisma.order.findUnique({
      where: { id },
      include: {
        lot: { select: { title: true } },
        shop: { select: { title: true } },
        buyer: { select: { login: true } },
        seller: { select: { login: true } },
      },
    });

    if (!order) {
      throw new NotFoundException('Заказ не найден');
    }
    return order;
  }


  //GET запрос на все заказы у продавца
  async findAllBySeller(sellerId: string) {
    return this.prisma.order.findMany({
      where: { sellerAccountId: sellerId },
      include: {
        lot: { select: { title: true } },
        buyer: { select: { login: true } },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  //GET запрос на получение всех заказов полкупателя
  async findAllByBuyer(buyerId: string) {
    return this.prisma.order.findMany({
      where: { buyerAccountId: buyerId },
      include: {
        lot: { select: { title: true } },
        seller: { select: { login: true } },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }
}