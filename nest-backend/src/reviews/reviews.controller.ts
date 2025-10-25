import { Controller, Get, Param, Post, Body, Req, UseGuards, UnauthorizedException, ParseUUIDPipe } from '@nestjs/common';
import { reviewService } from './reviews.service';
import { ReviewsDto } from './dto/reviews.dto';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('Reviews (Отзывы)')
@ApiBearerAuth() 
@Controller('reviews')
export class ReviewController {
    constructor(private readonly reviewService: reviewService) {}

    //Добавление отзыва
    @UseGuards(AuthGuard('jwt'))
    @Post()
    @ApiOperation({ summary: 'Создать новый отзыв' })
    @ApiResponse({ status: 201, description: 'Отзыв успешно создан.' })
    @ApiResponse({ status: 400, description: 'Неверный запрос (напр., отзыв уже существует).' })
    @ApiResponse({ status: 401, description: 'Пользователь не авторизован.' })
    @ApiResponse({ status: 404, description: 'Магазин или лот не найден.' })
    @ApiResponse({ status: 500, description: 'Внутренняя ошибка сервера.' })
    async createReview( @Req() req: any, @Body() dto: ReviewsDto) {
        const accountId = req.user.id;
        console.log("AccountID: ",accountId)
        if (!accountId) {
            throw new UnauthorizedException('Не удалось определить ID пользователя из токена');
        }

        return this.reviewService.createReviews(accountId, dto);
    }

    //Взять отзывы по id профиля продавца
    @Get('shop/:shopId')
    @ApiOperation({ summary: 'Получить все отзывы для магазина (продавца)' })
    @ApiResponse({ status: 200, description: 'Список отзывов успешно получен.' })
    @ApiResponse({ status: 404, description: 'Магазин не найден.' })
    async getReviewsForShop( @Param('shopId', ParseUUIDPipe) shopId: string ) {
        return this.reviewService.getReviewsForShop(shopId);
    }

    //Взять отзывы по id лота
    @Get('lot/:lotId')
    @ApiOperation({ summary: 'Получить все отзывы для конкретного товара (лота)' })
    @ApiResponse({ status: 200, description: 'Список отзывов успешно получен.' })
    @ApiResponse({ status: 404, description: 'Лот не найден.' })
    async getReviewsForLot( @Param('lotId', ParseUUIDPipe) lotId: string ) {
        return this.reviewService.getReviewsForLot(lotId);
    }
}