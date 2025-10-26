import { Controller, Post, Get, Delete, Param, Body, Headers, ParseUUIDPipe, HttpCode, UseGuards } from "@nestjs/common";
import { BadRequestException } from "@nestjs/common";
import { LotService } from "./lot.service";
import { LotDto } from "./dto/lot.dto";
import { ApiTags, ApiOperation, ApiResponse, ApiHeader, ApiParam } from "@nestjs/swagger";
import { AuthGuard } from '@nestjs/passport';
import { CurrentUser } from "src/auth/current-user.decorator";


@ApiTags('Lot')
@Controller('lots')
export class LotController {
    constructor(private readonly lotService: LotService) {}

    // ЗАПРОС НА СОЗДАНИЕ ЛОТА
    @Post('create')
    @ApiOperation({ summary: 'Запрос на создание лота' })
    @ApiHeader({ name: 'x-shop-id', description: 'Уникальный ID магазина',required: true, })
    @ApiHeader({ name: 'x-account-id', description: 'Уникальный ID аккаунта владельца', required: true, })
    @ApiResponse({ status: 400, description: 'Не переданы обязательные заголовки x-shop-id или x-account-id.' })
    @ApiResponse({ status: 201, description: 'Лот успешно создан!' })
    @ApiResponse({ status: 401, description: 'Ошибка авторизации (магазин/аккаунт не найден или не является владельцем)' })
     async lot( @Body() dto: LotDto, @Headers('x-shop-id') shopId: string, @Headers('x-account-id') accountId: string,) {
        if (!shopId || !accountId) {
            throw new BadRequestException('Необходимо передать shopId и accountId через заголовки x-shop-id и x-account-id.');
        }

        const createdLot = await this.lotService.createLot(shopId, accountId, dto);

        return createdLot;
    }

    // ЗАПРОС НА ПОЛУЧЕНИЕ ВСЕХ ЛОТОВ ДЛЯ КАТАЛОГА
    @Get()
    @ApiOperation({ summary: 'Получение всех лотов (для каталога)' })
    @ApiResponse({ status: 200, description: 'Список всех лотов успешно получен.' })
    @ApiResponse({ status: 500, description: 'Внутренняя ошибка сервера.'})
    async getAllLots() {
        return this.lotService.getAllLots();
    }

    // ЗАПРОС ДЛЯ ПОЛУЧЕНИЯ ОДНОГО ЛОТА ПО ID
    @Get(':id')
    @ApiOperation({ summary: 'Получение одного лота по ID' })
    @ApiParam({ name: 'id', description: 'Уникальный ID лота (UUID)', required: true, type: 'string' })
    @ApiResponse({ status: 200, description: 'Лот успешно найден.' })
    @ApiResponse({ status: 404, description: 'Лот с указанным ID не найден.' })
    @ApiResponse({ status: 400, description: 'Неверный формат ID.' })
    async getLotById(@Param('id', ParseUUIDPipe) id: string) {
        return this.lotService.getLotById(id);
    }

    // ЗАПРОС НА ПОЛУЧЕНИЕ ЛОТОВ КОНКРЕТНОГО ПРОДАВЦА
    @Get('by-account/:accountId')
    @ApiOperation({ summary: 'Получение всех лотов конкретного продавца' })
    @ApiParam({ name: 'accountId', description: 'Уникальный ID аккаунта продавца', required: true })
    @ApiResponse({ status: 200, description: 'Список лотов продавца успешно получен.' })
    @ApiResponse({ status: 404, description: 'Продавец с указанным ID не найден.' })
    async getLotsByAccountId(@Param('accountId') accountId: string) {
        if (!accountId) {
            throw new BadRequestException('Необходимо передать accountId в параметрах запроса.');
        }
        return this.lotService.getLotsByAccountId(accountId);
    }

    //DELETE ЗАПРОС НА УДАЛЕНИЕ ОДНОГО ЛОТА ПО ID
    @Delete(':id')
    @HttpCode(200)
    @UseGuards(AuthGuard('jwt'))
    @ApiOperation({ summary: 'Удаление одного лота по ID (только владельцем)' })
    @ApiParam({ name: 'id', description: 'Уникальный ID лота (UUID)', required: true, type: 'string' })
    @ApiResponse({ status: 200, description: 'Лот успешно удален' })
    @ApiResponse({ status: 401, description: 'Пользователь не авторизован' })
    @ApiResponse({ status: 403, description: 'Нет прав для удаления (не владелец)' })
    @ApiResponse({ status: 404, description: 'Лот с указанным ID не найден' })
    async deleteOrHideLotById( @Param('id', ParseUUIDPipe) lotId: string, @CurrentUser() user: any ) {
        console.log('ID пользователя из токена (user.id):', user.id);
        return this.lotService.deleteOrHideLotById(lotId, user.id);
    }
}