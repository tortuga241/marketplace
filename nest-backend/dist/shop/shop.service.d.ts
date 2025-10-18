import { OpenShopDto } from './dto/open-shop.dto';
export declare class ShopService {
    createShop(ownerId: string, dto: OpenShopDto): Promise<{
        type: string;
        description: string;
        title: string;
        id: string;
        createdAt: Date;
        ownerId: string;
        phone: string;
    }>;
    getShop(ownerId: string): Promise<{
        type: string;
        description: string;
        title: string;
        id: string;
        createdAt: Date;
        ownerId: string;
        phone: string;
    } | null>;
    updateShop(ownerId: string, dto: OpenShopDto): Promise<{
        type: string;
        description: string;
        title: string;
        id: string;
        createdAt: Date;
        ownerId: string;
        phone: string;
    }>;
}
