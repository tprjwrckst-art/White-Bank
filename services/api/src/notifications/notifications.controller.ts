import {
  Controller,
  Get,
  Put,
  Param,
  UseGuards,
  Request,
  Query,
} from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import {
  Notification,
  NotificationUpdateDto,
  PaginatedResponse,
} from '@whitebank/types';

@Controller('notifications')
@UseGuards(JwtAuthGuard)
export class NotificationsController {
  constructor(private notificationsService: NotificationsService) {}

  @Get()
  async getUserNotifications(
    @Query('limit') limit: number = 20,
    @Query('offset') offset: number = 0,
    @Query('unreadOnly') unreadOnly: boolean = false,
    @Request() req,
  ): Promise<PaginatedResponse<Notification>> {
    return this.notificationsService.getUserNotifications(
      req.user.id,
      limit,
      offset,
      unreadOnly,
    );
  }

  @Get(':id')
  async getNotification(
    @Param('id') notificationId: string,
    @Request() req,
  ): Promise<Notification> {
    return this.notificationsService.getNotification(
      notificationId,
      req.user.id,
    );
  }

  @Put(':id')
  async updateNotification(
    @Param('id') notificationId: string,
    @Request() req,
    @Query() updateDto: NotificationUpdateDto,
  ): Promise<Notification> {
    return this.notificationsService.updateNotification(
      notificationId,
      req.user.id,
      updateDto,
    );
  }

  @Get('unread/count')
  async getUnreadCount(@Request() req): Promise<{ unreadCount: number }> {
    return this.notificationsService.getUnreadCount(req.user.id);
  }
}
