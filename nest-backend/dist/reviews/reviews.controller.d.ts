import { reviewService } from './reviews.service';
import { ReviewsDto } from './dto/reviews.dto';
export declare class ReviewController {
    private readonly reviewService;
    constructor(reviewService: reviewService);
    createReview(req: any, dto: ReviewsDto): Promise<{
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
