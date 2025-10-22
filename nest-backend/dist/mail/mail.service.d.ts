import { ConfigService } from '@nestjs/config';
import { Order } from '@prisma/client';
export declare class MailService {
    private configService;
    private transporter;
    constructor(configService: ConfigService);
    sendOrderConfirmationToBuyer(buyerEmail: string, order: Order, lotSnapshot: any): Promise<void>;
    sendOrderNotificationToSeller(sellerEmail: string, order: Order, lotSnapshot: any): Promise<void>;
    sendPurchaseVerificationCode(email: string, code: string, lotTitle: string): Promise<void>;
}
