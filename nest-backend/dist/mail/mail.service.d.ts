import { ConfigService } from '@nestjs/config';
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
export declare class MailService {
    private configService;
    private transporter;
    constructor(configService: ConfigService);
    sendOrderConfirmationToBuyer(buyerEmail: string, orderData: OrderReceiptData, lotSnapshot: MinimalLotSnapshot): Promise<void>;
    sendOrderNotificationToSeller(sellerEmail: string, orderData: OrderReceiptData, lotSnapshot: MinimalLotSnapshot, buyerLogin?: string): Promise<void>;
    sendPurchaseVerificationCode(email: string, code: string, lotTitle: string): Promise<void>;
}
