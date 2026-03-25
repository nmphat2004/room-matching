import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateReviewDto } from './dto/review.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ReviewsService {
  constructor(private prisma: PrismaService) {}

  async findByRoom(roomId: string, page = 1, limit = 10) {
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
      },
      include: {
        reviewer: { select: { id: true, fullName: true, avatarUrl: true } },
      },
    });

    return review;
  }

  findAll() {
    return `This action returns all reviews`;
  }

  findOne(id: number) {
    return `This action returns a #${id} review`;
  }

  remove(id: number) {
    return `This action removes a #${id} review`;
  }
}
