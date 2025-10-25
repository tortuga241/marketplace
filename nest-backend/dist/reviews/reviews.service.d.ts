import { ReviewsDto } from './dto/reviews.dto';
export declare class reviewService {
    createReviews(accountId: string, dto: ReviewsDto): Promise<{
        description: string;
        id: string;
        createdAt: Date;
        accountId: string;
        shopId: string;
        lotId: string | null;
        rating: number;
        articleId: string | null;
    }>;
    getReviewsForShop(shopId: string): Promise<({
        account: {
            login: string;
            id: string;
        };
    } & {
        description: string;
        id: string;
        createdAt: Date;
        accountId: string;
        shopId: string;
        lotId: string | null;
        rating: number;
        articleId: string | null;
    })[]>;
    getReviewsForLot(lotId: string): Promise<({
        account: {
            login: string;
            id: string;
        };
    } & {
        description: string;
        id: string;
        createdAt: Date;
        accountId: string;
        shopId: string;
        lotId: string | null;
        rating: number;
        articleId: string | null;
    })[]>;
}
