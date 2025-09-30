import { OpenShopDto } from './dto/open-shop.dto';
export declare class ShopService {
    createShop(ownerId: string, dto: OpenShopDto): Promise<{
        type: string;
        title: string;
        id: string;
        discription: string;
        ownerId: string;
    }>;
    getShop(ownerId: string): Promise<{
        type: string;
        title: string;
        id: string;
        discription: string;
        ownerId: string;
    } | null>;
    updateShop(ownerId: string, dto: OpenShopDto): Promise<{
        type: string;
        title: string;
        id: string;
        discription: string;
        ownerId: string;
    }>;
}
