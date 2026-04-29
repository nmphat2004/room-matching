import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AdminService {
  constructor(private prisma: PrismaService) {}

  async getStats() {
    const [totalUsers, totalRooms, totalReviews] = await Promise.all([
      this.prisma.user.count({ where: { isDeleted: false } }),
      this.prisma.room.count(),
      this.prisma.review.count(),
    ]);
    return { totalUsers, totalRooms, totalReviews };
  }

  async getUsers() {
    return this.prisma.user.findMany({
      select: {
        id: true,
        fullName: true,
        email: true,
        role: true,
        phone: true,
        isDeleted: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async toggleUserBan(id: string) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) throw new NotFoundException('User not found');

    return this.prisma.user.update({
      where: { id },
      data: { isDeleted: !user.isDeleted },
    });
  }

  async getRooms(page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;

    const [rooms, total] = await Promise.all([
      this.prisma.room.findMany({
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          owner: { select: { fullName: true, email: true } },
        },
      }),
      this.prisma.room.count(),
    ]);

    return {
      data: rooms,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async changeRoomStatus(id: string, status: 'AVAILABLE' | 'HIDDEN') {
    return this.prisma.room.update({
      where: { id },
      data: { status },
    });
  }

  async removeRoom(id: string) {
    return this.prisma.room.delete({ where: { id } });
  }

  async getReviews(page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;

    // We fetch ratings to show details. We could also show fraud data here if stored.
    // Right now the fraud score/isVerified is stored in `isVerified` ? Review doesn't have fraudScore in schema?
    // Wait, let me check Prisma schema... Review model has 'isVerified'.

    const [reviews, total] = await Promise.all([
      this.prisma.review.findMany({
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          reviewer: { select: { fullName: true, email: true } },
          room: { select: { title: true } },
        },
      }),
      this.prisma.review.count(),
    ]);

    return {
      data: reviews,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async changeReviewStatus(id: string, isVerified: boolean) {
    return this.prisma.review.update({
      where: { id },
      data: { isVerified },
    });
  }

  async removeReview(id: string) {
    return this.prisma.review.delete({ where: { id } });
  }
}
