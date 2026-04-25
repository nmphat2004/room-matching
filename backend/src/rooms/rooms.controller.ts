/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { RoomsService } from './rooms.service';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateRoomDto, SearchRoomDto, UpdateRoomDto } from './dto/room.dto';
import { JwtGuard } from 'src/auth/guards/jwt.guard';

@ApiTags('Rooms')
@Controller('rooms')
export class RoomsController {
  constructor(private roomsService: RoomsService) {}

  @Get()
  @ApiOperation({ summary: 'Search and filter rooms' })
  findAll(@Query() query: SearchRoomDto) {
    return this.roomsService.findAll(query);
  }

  @Get('my-rooms')
  @ApiOperation({ summary: 'Get my rooms (landlord' })
  @ApiBearerAuth()
  @UseGuards(JwtGuard)
  getMyRomms(@Req() req: any) {
    return this.roomsService.findByOwner(req.user.id);
  }

  @Get('amenities')
  @ApiOperation({ summary: 'Get all available amenities' })
  findAllAmenities() {
    return this.roomsService.findAllAmenities();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get room detail' })
  findOne(@Param('id') id: string) {
    return this.roomsService.findOne(id);
  }

  @Post()
  @UseGuards(JwtGuard)
  @ApiOperation({ summary: 'Create new room listing (Landlord only' })
  @ApiBearerAuth()
  create(@Req() req: any, @Body() dto: CreateRoomDto) {
    return this.roomsService.create(req.user.id, dto);
  }

  @Put(':id')
  @UseGuards(JwtGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update room' })
  update(@Param('id') id: string, @Req() req: any, @Body() dto: UpdateRoomDto) {
    return this.roomsService.update(id, req.user.id, dto);
  }

  @Delete(':id')
  @UseGuards(JwtGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete room' })
  remove(@Param('id') id: string, @Req() req: any) {
    return this.roomsService.remove(id, req.user.id, req.user.role);
  }
}
