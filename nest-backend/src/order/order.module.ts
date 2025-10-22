import { Module } from '@nestjs/common';
import { OrdersService } from './order.service';
import { OrdersController } from './order.controller';
import { PrismaModule } from '../prisma/prisma.module'; 
import { MailModule } from '../mail/mail.module'; 

@Module({
  imports: [PrismaModule, MailModule], 
  controllers: [OrdersController],
  providers: [OrdersService],
})
export class OrdersModule {}