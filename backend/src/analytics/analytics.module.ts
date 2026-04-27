import { Module } from '@nestjs/common';
import { AnalyticsController } from './analytics.controller';
import { SeasonalService } from './seasonal.service';
import { NeighborhoodService } from './neighborhood.service';
import { PriceEstimatorService } from './price-estimator.service';

@Module({
  controllers: [AnalyticsController],
  providers: [SeasonalService, NeighborhoodService, PriceEstimatorService],
  exports: [SeasonalService, NeighborhoodService, PriceEstimatorService],
})
export class AnalyticsModule {}
