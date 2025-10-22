import { PrismaService } from '../prisma/prisma.service';
import { MailService } from '../mail/mail.service';
import { CreateOrderDto } from './dto/order-create.dto';
import { CompleteOrderDto } from './dto/order-complete.dto';
import { ResendCodeDto } from './dto/order-resend.dto';
import { Prisma } from '@prisma/client';
export declare class OrdersService {
    private prisma;
    private mailService;
    constructor(prisma: PrismaService, mailService: MailService);
    private generateVerificationCode;
    initiatePurchase(createOrderDto: CreateOrderDto, buyerAccountId: string): Promise<{
        message: string;
        verificationId: string;
        expiresAt: Date;
        buyerEmail: string;
    }>;
    completePurchase(completeOrderDto: CompleteOrderDto, buyerAccountId: string): Promise<{
        code: string;
        id: string;
        createdAt: Date;
        cost: number;
        shopId: string;
        lotId: string;
        lotSnapshot: Prisma.JsonValue | null;
        sellerAccountId: string;
        buyerAccountId: string;
        status: string;
        updatedAt: Date;
    }>;
    resendVerificationCode(resendCodeDto: ResendCodeDto, buyerAccountId: string): Promise<{
        message: string;
        expiresAt: Date;
    }>;
    findOne(id: string): Promise<{
        shop: {
            title: string;
        };
        lot: {
            title: string;
        };
        buyer: {
            login: string;
        };
        seller: {
            login: string;
        };
    } & {
        code: string;
        id: string;
        createdAt: Date;
        cost: number;
        shopId: string;
        lotId: string;
        lotSnapshot: Prisma.JsonValue | null;
        sellerAccountId: string;
        buyerAccountId: string;
        status: string;
        updatedAt: Date;
    }>;
    findAllBySeller(sellerId: string): Promise<({
        lot: {
            title: string;
        };
        buyer: {
            login: string;
        };
    } & {
        code: string;
        id: string;
        createdAt: Date;
        cost: number;
        shopId: string;
        lotId: string;
        lotSnapshot: Prisma.JsonValue | null;
        sellerAccountId: string;
        buyerAccountId: string;
        status: string;
        updatedAt: Date;
    })[]>;
    findAllByBuyer(buyerId: string): Promise<({
        lot: {
            title: string;
        };
        seller: {
            login: string;
        };
    } & {
        code: string;
        id: string;
        createdAt: Date;
        cost: number;
        shopId: string;
        lotId: string;
        lotSnapshot: Prisma.JsonValue | null;
        sellerAccountId: string;
        buyerAccountId: string;
        status: string;
        updatedAt: Date;
    })[]>;
}
