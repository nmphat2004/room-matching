import {
  Controller,
  Get,
  Put,
  Delete,
  Param,
  UseGuards,
  Query,
  Body,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { AdminService } from './admin.service';
import { JwtGuard } from '../auth/guards/jwt.guard';
import { AdminGuard } from '../auth/guards/admin.guard';

@ApiTags('Admin')
@Controller('admin')
@UseGuards(JwtGuard, AdminGuard)
@ApiBearerAuth()
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('stats')
  @ApiOperation({ summary: 'Get basic admin dashboard stats' })
  getStats() {
    return this.adminService.getStats();
  }

  // --- Users Management ---
  @Get('users')
  @ApiOperation({ summary: 'Get all users' })
  getUsers() {
    return this.adminService.getUsers();
  }

  @Put('users/:id/ban')
  @ApiOperation({ summary: 'Toggle user ban status (deleted)' })
  toggleUserBan(@Param('id') id: string) {
    return this.adminService.toggleUserBan(id);
  }

  // --- Rooms Management ---
  @Get('rooms')
  @ApiOperation({ summary: 'Get all rooms' })
  getRooms(
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '10',
  ) {
    return this.adminService.getRooms(parseInt(page, 10), parseInt(limit, 10));
  }

  @Put('rooms/:id/status')
  @ApiOperation({ summary: 'Change room status (AVAILABLE/HIDDEN)' })
  changeRoomStatus(
    @Param('id') id: string,
    @Body('status') status: 'AVAILABLE' | 'HIDDEN',
  ) {
    return this.adminService.changeRoomStatus(id, status);
  }

  @Delete('rooms/:id')
  @ApiOperation({ summary: 'Delete a room' })
  removeRoom(@Param('id') id: string) {
    return this.adminService.removeRoom(id);
  }

  // --- Reviews Management ---
  @Get('reviews')
  @ApiOperation({ summary: 'Get all reviews' })
  getReviews(
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '10',
  ) {
    return this.adminService.getReviews(
      parseInt(page, 10),
      parseInt(limit, 10),
    );
  }

  @Put('reviews/:id/status')
  @ApiOperation({ summary: 'Approve or reject a review' })
  changeReviewStatus(
    @Param('id') id: string,
    @Body('isVerified') isVerified: boolean,
  ) {
    return this.adminService.changeReviewStatus(id, isVerified);
  }

  @Delete('reviews/:id')
  @ApiOperation({ summary: 'Delete a review' })
  removeReview(@Param('id') id: string) {
    return this.adminService.removeReview(id);
  }
}
