import { OrdersService } from './order.service';
import { CreateOrderDto } from './dto/order-create.dto';
import { CompleteOrderDto } from './dto/order-complete.dto';
import { ResendCodeDto } from './dto/order-resend.dto';
interface AuthenticatedRequest extends Request {
    user: {
        id: string;
    };
}
export declare class OrdersController {
    private readonly ordersService;
    constructor(ordersService: OrdersService);
    initiate(createOrderDto: CreateOrderDto, req: AuthenticatedRequest, buyerAccountId: string): Promise<{
        message: string;
        verificationId: string;
        expiresAt: Date;
        buyerEmail: string;
    }>;
    complete(completeOrderDto: CompleteOrderDto, req: AuthenticatedRequest): Promise<{
        code: string;
        id: string;
        createdAt: Date;
        cost: number;
        shopId: string;
        lotId: string;
        buyerAccountId: string;
        sellerAccountId: string;
        lotSnapshot: import("@prisma/client/runtime/library").JsonValue | null;
        status: string;
        updatedAt: Date;
    }>;
    resend(resendCodeDto: ResendCodeDto, req: AuthenticatedRequest): Promise<{
        message: string;
        expiresAt: Date;
    }>;
    findMyPurchases(buyerId: string): Promise<({
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
        buyerAccountId: string;
        sellerAccountId: string;
        lotSnapshot: import("@prisma/client/runtime/library").JsonValue | null;
        status: string;
        updatedAt: Date;
    })[]>;
    findMySales(sellerId: string): Promise<({
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
        buyerAccountId: string;
        sellerAccountId: string;
        lotSnapshot: import("@prisma/client/runtime/library").JsonValue | null;
        status: string;
        updatedAt: Date;
    })[]>;
    findOne(id: string, req: AuthenticatedRequest): Promise<{
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
        buyerAccountId: string;
        sellerAccountId: string;
        lotSnapshot: import("@prisma/client/runtime/library").JsonValue | null;
        status: string;
        updatedAt: Date;
    }>;
}
export {};
