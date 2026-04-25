import { PrismaService } from 'src/prisma/prisma.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class NotificationsService {
  constructor(private prisma: PrismaService) {}

  async create(data: {
    userId: string;
    type: string;
    title: string;
    content: string;
    link?: string;
  }) {
    return this.prisma.notification.create({ data });
  }

  async getMyNotifications(userId: string) {
    return this.prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 30,
    });
  }

  async getUnreadCount(userId: string) {
    const unread = await this.prisma.notification.count({
      where: { userId, isRead: false, type: { not: 'NEW_MESSAGE' } },
    });
    return { unread };
  }

  async markRead(userId: string, id: string) {
    await this.prisma.notification.updateMany({
      where: { id, userId },
      data: { isRead: true },
    });
    return { success: true };
  }

  async markAllRead(userId: string) {
    await this.prisma.notification.updateMany({
      where: { userId, isRead: false },
      data: { isRead: true },
    });
    return { success: true };
  }

  async getPreferences(userId: string) {
    return this.prisma.notificationPreference.upsert({
      where: { userId },
      update: {},
      create: { userId },
    });
  }

  async updatePreferences(
    userId: string,
    dto: {
      newMessage?: boolean;
      savedListing?: boolean;
      newReview?: boolean;
      priceAlert?: boolean;
    },
  ) {
    return this.prisma.notificationPreference.update({
      where: { userId },
      data: dto,
    });
  }
}
