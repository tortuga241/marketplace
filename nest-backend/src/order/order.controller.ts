import { Controller, Get, Post, Body, Param, UseGuards, Req, ParseUUIDPipe, ForbiddenException } from '@nestjs/common';
import { OrdersService } from './order.service';
import { CreateOrderDto } from './dto/order-create.dto';
import { CompleteOrderDto } from './dto/order-complete.dto';
import { ResendCodeDto } from './dto/order-resend.dto';
import { ApiTags, ApiOperation, ApiParam } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { CurrentUser } from '../auth/current-user.decorator';

interface AuthenticatedRequest extends Request { user: { id: string } }

@ApiTags('orders')
@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  // 1. Инициировать покупку (создать OrderVerification, отправить код)
  @Post('initiate')
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: '1. Инициировать покупку (отправить код на почту)' })
  initiate( @Body() createOrderDto: CreateOrderDto, @Req() req: AuthenticatedRequest, @CurrentUser('id') buyerAccountId: string ) {
    return this.ordersService.initiatePurchase( createOrderDto, buyerAccountId );
  }

  // 2. Завершить покупку (проверить код, создать Order)
  @Post('complete')
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: '2. Завершить покупку (проверить код и создать заказ)' })
  complete(
    @Body() completeOrderDto: CompleteOrderDto,
    @Req() req: AuthenticatedRequest,
  ) {
    const buyerAccountId = req.user.id;
    return this.ordersService.completePurchase(completeOrderDto, buyerAccountId);
  }

  // 3. Отправить код повторно
  @Post('resend')
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: '3. Отправить код верификации повторно' })
  resend(
    @Body() resendCodeDto: ResendCodeDto,
    @Req() req: AuthenticatedRequest,
  ) {
    return this.ordersService.resendVerificationCode(
      resendCodeDto,
      req.user.id,
    );
  }

  //Безопасные запросы для получения заказов
  @Get('my-purchases')
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'Получить МОИ покупки (безопасно)' })
  findMyPurchases(@CurrentUser('id') buyerId: string) { // <--- ИЗМЕНЕНО
    console.log('Current user ID:', buyerId); // <--- Теперь тут будет реальный ID
    return this.ordersService.findAllByBuyer(buyerId);
  }

  @Get('my-sales')
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'Получить МОИ продажи (безопасно)' })
  @ApiOperation({ summary: 'Получить МОИ продажи (безопасно)' })
  findMySales(@CurrentUser('id') sellerId: string) { // <--- ИЗМЕНЕНО
    return this.ordersService.findAllBySeller(sellerId);
  }

  //GET запрос на получение по ID
  @Get(':id')
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'Получить один заказ по ID' })
  @ApiParam({ name: 'id', description: 'UUID Заказа' })
  async findOne( @Param('id', ParseUUIDPipe) id: string, @Req() req: AuthenticatedRequest,) {
    const order = await this.ordersService.findOne(id);
    if (
      order.buyerAccountId !== req.user.id &&
      order.sellerAccountId !== req.user.id
    ) {
      throw new ForbiddenException('У вас нет доступа к этому заказу');
    }
    return order;
  }
}