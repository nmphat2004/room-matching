/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Controller, Get, Query, UseGuards, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { RecommendationService } from './recommendation.service';
import { JwtGuard } from '../auth/guards/jwt.guard';

@ApiTags('Recommendation')
@Controller('recommendations')
export class RecommendationController {
  constructor(private recommendationService: RecommendationService) {}

  @Get()
  @UseGuards(JwtGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get personalized room recommendations' })
  getRecommendations(@Req() req: any, @Query('limit') limit = 8) {
    return this.recommendationService.getRecommendations(req.user.id, +limit);
  }

  // Public endpoint — không cần login, trả phòng nổi bật
  @Get('popular')
  @ApiOperation({ summary: 'Get popular rooms (no login required)' })
  getPopular(@Query('limit') limit = 8) {
    return this.recommendationService.getPopularRooms(+limit);
  }
}
