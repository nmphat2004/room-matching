/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateRoomDto, SearchRoomDto, UpdateRoomDto } from './dto/room.dto';

@Injectable()
export class RoomsService {
  constructor(private prisma: PrismaService) {}

  async create(ownerId: string, dto: CreateRoomDto) {
    const room = await this.prisma.room.create({
      data: {
        ownerId,
        title: dto.title,
        price: dto.price,
        description: dto.description,
        address: dto.address,
        lat: dto.lat,
        lng: dto.lng,
        area: dto.area,
        floor: dto.floor,
        images: dto.imageUrls
          ? {
              create: dto.imageUrls.map((url, index) => ({
                url,
                isPrimary: url === dto.primaryImageUrl || index === 0,
              })),
            }
          : undefined,
        amenities: dto.amenityIds
          ? {
              create: dto.amenityIds.map((amenityId) => ({ amenityId })),
            }
          : undefined,
      },
      include: {
        images: true,
        amenities: { include: { amenity: true } },
        owner: {
          select: { id: true, fullName: true, phone: true, avatarUrl: true },
        },
      },
    });

    return room;
  }

  async update(id: string, ownerId: string, dto: UpdateRoomDto) {
    const { amenityIds, imageUrls, ...rest } = dto;
    const room = await this.prisma.room.findUnique({ where: { id } });
    if (!room) throw new NotFoundException('Room not found');
    if (room.ownerId !== ownerId) throw new ForbiddenException('Not your room');

    return this.prisma.room.update({
      where: { id },
      data: {
        ...rest,
        amenities: amenityIds
          ? {
              deleteMany: {},
              create: amenityIds.map((amenityId) => ({
                amenityId,
              })),
            }
          : undefined,
        images: imageUrls
          ? {
              deleteMany: {},
              create: imageUrls.map((url, index) => ({
                url,
                isPrimary: index === 0,
              })),
            }
          : undefined,
      },
      include: {
        images: true,
        amenities: { include: { amenity: true } },
      },
    });
  }

  async remove(id: string, ownerId: string, role: string) {
    const room = await this.prisma.room.findUnique({ where: { id } });
    if (!room) throw new NotFoundException('Room not found');

    if (role !== 'ADMIN' && room.ownerId !== ownerId) {
      throw new ForbiddenException('Not your room');
    }

    await this.prisma.room.delete({ where: { id } });
    return { message: 'Room deleted successfully' };
  }

  async findOne(id: string) {
    const room = await this.prisma.room.findUnique({
      where: { id },
      include: {
        images: true,
        amenities: { include: { amenity: true } },
        owner: {
          select: {
            id: true,
            fullName: true,
            phone: true,
            avatarUrl: true,
            createdAt: true,
          },
        },
        reviews: {
          include: {
            reviewer: {
              select: { id: true, fullName: true, avatarUrl: true },
            },
          },
          orderBy: { createdAt: 'desc' },
          take: 5,
        },
      },
    });

    if (!room) throw new NotFoundException('Room not found');

    await this.prisma.room.update({
      where: { id },
      data: { viewCount: { increment: 1 } },
    });

    return room;
  }

  async findAll(dto: SearchRoomDto) {
    const {
      keyword,
      minPrice,
      maxPrice,
      minArea,
      maxArea,
      minRating,
      page = 1,
      limit = 10,
      sortBy = 'newest',
    } = dto;

    const where: any = {
      status: 'AVAILABLE',
      ...(keyword && {
        OR: [
          { title: { contains: keyword, mode: 'insensitive' } },
          { address: { contains: keyword, mode: 'insensitive' } },
          { description: { contains: keyword, mode: 'insensitive' } },
        ],
      }),
      ...(minPrice || maxPrice
        ? {
            price: {
              ...(minPrice && { gte: minPrice }),
              ...(maxPrice && { lte: maxPrice }),
            },
          }
        : {}),

      ...(minArea || maxArea
        ? {
            area: {
              ...(minArea && { gte: minArea }),
              ...(maxArea && { lte: maxArea }),
            },
          }
        : {}),
      ...(minRating && { avgRating: { gte: minRating } }),
    };

    const orderBy: any = {
      newest: { createdAt: 'desc' },
      price_asc: { price: 'asc' },
      price_desc: { price: 'desc' },
      rating: { avgRating: 'desc' },
    }[sortBy] ?? { createdAt: 'desc' };

    const skip = (page - 1) * limit;

    const [rooms, total] = await Promise.all([
      this.prisma.room.findMany({
        where,
        orderBy,
        skip,
        take: limit,
        include: {
          images: { where: { isPrimary: true }, take: 1 },
          amenities: { include: { amenity: true } },
          owner: {
            select: { id: true, fullName: true, avatarUrl: true },
          },
        },
      }),
      this.prisma.room.count({ where }),
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

  async findByOwner(ownerId: string) {
    return this.prisma.room.findMany({
      where: { ownerId },
      include: {
        images: { where: { isPrimary: true }, take: 4 },
        _count: { select: { reviews: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }
}
