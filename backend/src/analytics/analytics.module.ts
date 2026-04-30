import { Module } from '@nestjs/common';
import { AnalyticsController } from './analytics.controller';
import { SeasonalService } from './seasonal.service';
import { NeighborhoodService } from './neighborhood.service';
import { PriceEstimatorService } from './price-estimator.service';
import { AiService } from './ai.service';
import { GeocodingService } from './geocoding.service';

@Module({
  controllers: [AnalyticsController],
  providers: [
    SeasonalService,
    NeighborhoodService,
    PriceEstimatorService,
    AiService,
    GeocodingService,
  ],
  exports: [
    SeasonalService,
    NeighborhoodService,
    PriceEstimatorService,
    GeocodingService,
  ],
})
export class AnalyticsModule {}
