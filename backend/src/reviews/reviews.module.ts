import { Module } from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { ReviewsController } from './reviews.controller';
import { FraudModule } from '../fraud/fraud.module';
import { AnalyticsModule } from '../analytics/analytics.module';

@Module({
  imports: [FraudModule, AnalyticsModule],
  controllers: [ReviewsController],
  providers: [ReviewsService],
  exports: [ReviewsService],
})
export class ReviewsModule {}
