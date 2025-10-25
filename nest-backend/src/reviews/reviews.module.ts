import { Module } from '@nestjs/common';
import { ReviewController } from './reviews.controller';
import { reviewService } from './reviews.service';
import { AuthModule } from '../auth/auth.module';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [
    AuthModule,
    PrismaModule
  ],
  controllers: [ReviewController],
  providers: [reviewService]
})
export class ReviewModule {}