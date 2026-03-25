/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { CreateReviewDto } from './dto/review.dto';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtGuard } from 'src/auth/guards/jwt.guard';

@ApiTags('Reviews')
@Controller('rooms/:roomId/reviews')
export class ReviewsController {
  constructor(private reviewsService: ReviewsService) {}

  @Get()
  @ApiOperation({ summary: 'Get reviews for a room' })
  findByRoom(
    @Param('roomId') roomId: string,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ) {
    return this.reviewsService.findByRoom(roomId, page, limit);
  }

  @Post()
  @ApiOperation({ summary: 'Create a review' })
  @ApiBearerAuth()
  @UseGuards(JwtGuard)
  create(
    @Param('roomId') roomId: string,
    @Req() req: any,
    @Body() dto: CreateReviewDto,
  ) {
    return this.reviewsService.create(roomId, req.user.id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a review' })
  @ApiBearerAuth()
  @UseGuards(JwtGuard)
  remove(@Param('id') id: string, @Req() req: any) {
    return this.reviewsService.remove(id, req.user.id, req.user.role);
  }
}
