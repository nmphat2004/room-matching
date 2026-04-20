/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { NotificationsService } from './notifications.service';
import { JwtGuard } from 'src/auth/guards/jwt.guard';

@ApiTags('Notifications')
@UseGuards(JwtGuard)
@ApiBearerAuth()
@Controller('notifications')
export class NotificationsController {
  constructor(private notificationsService: NotificationsService) {}

  @Get()
  @ApiOperation({ summary: 'Get my notifications' })
  getMyNotifications(@Req() req: any) {
    return this.notificationsService.getMyNotifications(req.user.id);
  }

  @Get('unread-count')
  @ApiOperation({ summary: 'Get unread notifications count' })
  getUnreadCount(@Req() req: any) {
    return this.notificationsService.getUnreadCount(req.user.id);
  }

  @Put(':id/read')
  @ApiOperation({ summary: 'Mark one notification as read' })
  markRead(@Req() req: any, @Param('id') id: string) {
    return this.notificationsService.markRead(req.user.id, id);
  }

  @Put('read-all')
  @ApiOperation({ summary: 'Mark all notifications as read' })
  markAllRead(@Req() req: any) {
    return this.notificationsService.markAllRead(req.user.id);
  }

  @Get('preferences')
  @ApiOperation({ summary: 'Get notification preferences' })
  getPreferences(@Req() req: any) {
    return this.notificationsService.getPreferences(req.user.id);
  }

  @Post('preferences')
  @ApiOperation({ summary: 'Update notification preferences' })
  updatePreferences(
    @Req() req: any,
    @Body()
    dto: {
      newMessage?: boolean;
      savedListing?: boolean;
      newReview?: boolean;
      priceAlert?: boolean;
    },
  ) {
    return this.notificationsService.updatePreferences(req.user.id, dto);
  }
}
