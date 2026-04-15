/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateReviewDto } from './dto/review.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { FakeReviewService } from 'src/fraud/fake-review.service';

@Injectable()
export class ReviewsService {
  constructor(
    private prisma: PrismaService,
    private fakeReviewService: FakeReviewService,
  ) {}

  async findByRoom(roomId: string, page: number = 1, limit: number = 10) {
    const room = await this.prisma.room.findUnique({ where: { id: roomId } });
    if (!room) throw new NotFoundException('Room not found');

    const skip = (page - 1) * limit;

    const [reviews, total] = await Promise.all([
      this.prisma.review.findMany({
        where: { roomId },
        include: {
          reviewer: {
            select: { id: true, fullName: true, avatarUrl: true },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      this.prisma.review.count({ where: { roomId } }),
    ]);

    const avgScores = await this.prisma.review.aggregate({
      where: { roomId },
      _avg: {
        rating: true,
        cleanRating: true,
        securityRating: true,
        locationRating: true,
        landlordRating: true,
      },
    });

    return {
      data: reviews,
      avgScores: avgScores._avg,
      meta: {
        total,
        page,
        limit,
        totalPage: Math.ceil(total / limit),
      },
    };
  }

  async create(roomId: string, reviewerId: string, dto: CreateReviewDto) {
    const room = await this.prisma.room.findUnique({ where: { id: roomId } });
    if (!room) throw new NotFoundException('Room not found');

    if (room.ownerId === reviewerId) {
      throw new ForbiddenException('Cannot review your own room');
    }

    const existing = await this.prisma.review.findFirst({
      where: { roomId, reviewerId },
    });

    if (existing)
      throw new BadRequestException('You have already reviewed this room');

    const fraudResult = await this.fakeReviewService.analyze(
      reviewerId,
      roomId,
      dto.rating,
      dto.comment || '',
    );

    if (fraudResult.action === 'reject') {
      throw new BadRequestException(
        'Đánh giá bị từ chối vì có dấu hiệu không hợp lệ',
      );
    }

    const review = await this.prisma.review.create({
      data: {
        roomId,
        reviewerId,
        rating: dto.rating,
        cleanRating: dto.cleanRating,
        securityRating: dto.securityRating,
        landlordRating: dto.landlordRating,
        locationRating: dto.locationRating,
        comment: dto.comment,
        isVerified: fraudResult.action === 'approve',
      },
      include: {
        reviewer: { select: { id: true, fullName: true, avatarUrl: true } },
      },
    });

    await this.updateRoomRating(roomId);

    if (dto.comment)
      this.analyzeSentiment(review.id, dto.comment).catch(console.error);

    return {
      ...review,
      fraudScore: fraudResult.score,
      isFlagged: fraudResult.action === 'flag',
    };
  }

  async remove(id: string, userId: string, role: string) {
    const review = await this.prisma.review.findUnique({ where: { id } });
    if (!review) throw new NotFoundException('Review not found');

    if (role !== 'ADMIN' && review.reviewerId !== userId)
      throw new ForbiddenException('Cannot delete this review');

    await this.prisma.review.delete({ where: { id } });

    await this.updateRoomRating(review.roomId);

    return { message: 'Review deleted successfully' };
  }

  private async updateRoomRating(roomId: string) {
    const result = await this.prisma.review.aggregate({
      where: { roomId },
      _avg: { rating: true },
      _count: { id: true },
    });

    await this.prisma.room.update({
      where: { id: roomId },
      data: {
        avgRating: result._avg.rating ?? 0,
        reviewCount: result._count.id,
      },
    });
  }

  private async analyzeSentiment(reviewId: string, comment: string) {
    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  {
                    text: `Phân tích cảm xúc của đánh giá phòng trọ sau và trả về 1 trong 3 từ: "positive", "negative", "neutral". Chỉ trả về 1 từ duy nhất, không giải thích.
                
Đánh giá: "${comment}"`,
                  },
                ],
              },
            ],
          }),
        },
      );

      const data = await response.json();
      const sentiment = data.candidates?.[0]?.contents?.parts?.[0]?.text
        ?.trim()
        ?.toLowerCase();

      if (['positive', 'negative', 'neutral'].includes(sentiment)) {
        await this.prisma.review.update({
          where: { id: reviewId },
          data: { sentiment },
        });
      }
    } catch (error) {
      console.log('Sentinent analysis failed:', error);
    }
  }
}
