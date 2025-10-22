import { LotService } from "./lot.service";
import { LotDto } from "./dto/lot.dto";
export declare class LotController {
    private readonly lotService;
    constructor(lotService: LotService);
    lot(dto: LotDto, shopId: string, accountId: string): Promise<{
        type: string;
        description: string;
        title: string;
        id: string;
        createdAt: Date;
        cost: string;
        accountId: string;
        isHidden: boolean;
        shopId: string;
    }>;
    getAllLots(): Promise<{
        type: string;
        description: string;
        title: string;
        id: string;
        createdAt: Date;
        cost: string;
        accountId: string;
        isHidden: boolean;
        shopId: string;
    }[]>;
    getLotById(id: string): Promise<{
        shop: {
            owner: {
                login: string;
            };
        } & {
            type: string;
            description: string;
            title: string;
            id: string;
            createdAt: Date;
            ownerId: string;
            phone: string;
        };
    } & {
        type: string;
        description: string;
        title: string;
        id: string;
        createdAt: Date;
        cost: string;
        accountId: string;
        isHidden: boolean;
        shopId: string;
    }>;
    getLotsByAccountId(accountId: string): Promise<{
        type: string;
        description: string;
        title: string;
        id: string;
        createdAt: Date;
        cost: string;
        accountId: string;
        isHidden: boolean;
        shopId: string;
    }[]>;
    deleteOrHideLotById(lotId: string, user: any): Promise<{
        message: string;
        id: string;
        status: string;
    }>;
}
