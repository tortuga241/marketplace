import { LotDto } from './dto/lot.dto';
export declare class LotService {
    createLot(shopId: string, accountId: string, dto: LotDto): Promise<{
        type: string;
        description: string;
        title: string;
        id: string;
        createdAt: Date;
        cost: string;
        accountId: string;
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
        shopId: string;
    }[]>;
    deleteLotById(lotId: string, accountId: string): Promise<{
        message: string;
        id: string;
        title: string;
    }>;
}
