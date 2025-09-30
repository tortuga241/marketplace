import { ShopService } from "./shop.service";
import { OpenShopDto } from "./dto/open-shop.dto";
export declare class ShopController {
    private readonly shopService;
    constructor(shopService: ShopService);
    createShop(req: any, dto: OpenShopDto): Promise<{
        type: string;
        title: string;
        id: string;
        discription: string;
        ownerId: string;
    }>;
    getShop(req: any): Promise<{
        type: string;
        title: string;
        id: string;
        discription: string;
        ownerId: string;
    } | null>;
    updateShop(req: any, dto: OpenShopDto): Promise<{
        type: string;
        title: string;
        id: string;
        discription: string;
        ownerId: string;
    }>;
}
