import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateConversationDto, SendMessageDto } from './dto/chat.dto';

@Injectable()
export class ChatService {
  constructor(private prisma: PrismaService) {}

  async getConversations(userId: string) {
    return this.prisma.conversation.findMany({
      where: {
        OR: [{ renterId: userId }, { ownerId: userId }],
      },
      include: {
        room: {
          select: {
            id: true,
            title: true,
            price: true,
            images: {
              where: { isPrimary: true },
              take: 1,
            },
          },
        },
        renter: {
          select: {
            id: true,
            fullName: true,
            avatarUrl: true,
          },
        },
        owner: {
          select: {
            id: true,
            fullName: true,
            avatarUrl: true,
          },
        },
        messages: {
          orderBy: { sentAt: 'desc' },
          take: 1,
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getMessages(
    conversationId: string,
    userId: string,
    page = 1,
    limit = 20,
  ) {
    const conversation = await this.prisma.conversation.findUnique({
      where: { id: conversationId },
    });

    if (!conversation) throw new NotFoundException('Conversation not found');

    if (conversation.ownerId !== userId && conversation.renterId !== userId) {
      throw new ForbiddenException('Not your conversation');
    }

    const skip = (page - 1) * limit;

    const [messages, total] = await Promise.all([
      this.prisma.message.findMany({
        where: { conversationId },
        include: {
          sender: {
            select: { id: true, fullName: true, avatarUrl: true },
          },
        },
        orderBy: { sentAt: 'desc' },
        skip,
        take: limit,
      }),
      this.prisma.message.count({ where: { conversationId } }),
    ]);

    return {
      data: messages.reverse(),
      meta: {
        total,
        page,
        limit,
        totalPage: Math.ceil(total / limit),
      },
    };
  }

  async getOrCreateConversation(renterId: string, dto: CreateConversationDto) {
    const room = await this.prisma.room.findUnique({
      where: { id: dto.roomId },
    });

    if (!room) throw new NotFoundException('Room not found');

    if (room.ownerId === renterId)
      throw new ForbiddenException('Cannot chat with yourself');

    const existing = await this.prisma.conversation.findUnique({
      where: {
        roomId_renterId: {
          roomId: dto.roomId,
          renterId,
        },
      },
      include: {
        room: {
          select: {
            id: true,
            title: true,
            price: true,
          },
        },
        renter: { select: { id: true, fullName: true, avatarUrl: true } },
      },
    });

    if (existing) return existing;

    return await this.prisma.conversation.create({
      data: {
        roomId: dto.roomId,
        renterId,
        ownerId: room.ownerId,
      },
      include: {
        room: {
          select: {
            id: true,
            title: true,
            price: true,
          },
        },
        renter: { select: { id: true, fullName: true, avatarUrl: true } },
      },
    });
  }

  async saveMessage(senderId: string, dto: SendMessageDto) {
    const conversation = await this.prisma.conversation.findUnique({
      where: { id: dto.conversationId },
    });

    if (!conversation) throw new NotFoundException('Conversation not found');

    if (
      conversation.renterId !== senderId &&
      conversation.ownerId !== senderId
    ) {
      throw new ForbiddenException('Not your conversation');
    }

    return this.prisma.message.create({
      data: {
        conversationId: dto.conversationId,
        senderId,
        content: dto.content,
      },
      include: {
        sender: {
          select: { id: true, fullName: true, avatarUrl: true },
        },
      },
    });
  }
}
