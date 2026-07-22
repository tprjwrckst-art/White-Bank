import { Injectable, NotFoundException } from '@nestjs/common';
import prisma from '../prisma';
import {
  Notification,
  NotificationUpdateDto,
  NotificationType,
  PaginatedResponse,
} from '@whitebank/types';

@Injectable()
export class NotificationsService {
  async createNotification(
    userId: string,
    type: NotificationType,
    title: string,
    message: string,
    data?: Record<string, any>,
  ): Promise<Notification> {
    const notification = await prisma.notification.create({
      data: {
        userId,
        type,
        title,
        message,
        data: data || {},
      },
    });

    return this.mapNotificationResponse(notification);
  }

  async getUserNotifications(
    userId: string,
    limit: number,
    offset: number,
    unreadOnly: boolean = false,
  ): Promise<PaginatedResponse<Notification>> {
    const where: any = { userId };
    if (unreadOnly) {
      where.isRead = false;
    }

    const [notifications, total] = await Promise.all([
      prisma.notification.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        take: limit,
        skip: offset,
      }),
      prisma.notification.count({ where }),
    ]);

    return {
      data: notifications.map((n) => this.mapNotificationResponse(n)),
      total,
      page: Math.floor(offset / limit) + 1,
      limit,
      hasMore: offset + limit < total,
    };
  }

  async getNotification(
    notificationId: string,
    userId: string,
  ): Promise<Notification> {
    const notification = await prisma.notification.findFirst({
      where: {
        id: notificationId,
        userId,
      },
    });

    if (!notification) {
      throw new NotFoundException('Notification not found');
    }

    return this.mapNotificationResponse(notification);
  }

  async updateNotification(
    notificationId: string,
    userId: string,
    updateDto: NotificationUpdateDto,
  ): Promise<Notification> {
    const notification = await prisma.notification.findFirst({
      where: {
        id: notificationId,
        userId,
      },
    });

    if (!notification) {
      throw new NotFoundException('Notification not found');
    }

    const updatedNotification = await prisma.notification.update({
      where: { id: notificationId },
      data: {
        isRead: updateDto.isRead,
        ...(updateDto.isRead && { readAt: new Date() }),
      },
    });

    return this.mapNotificationResponse(updatedNotification);
  }

  async getUnreadCount(userId: string): Promise<{ unreadCount: number }> {
    const unreadCount = await prisma.notification.count({
      where: {
        userId,
        isRead: false,
      },
    });

    return { unreadCount };
  }

  async markAllAsRead(userId: string): Promise<{ modifiedCount: number }> {
    const result = await prisma.notification.updateMany({
      where: {
        userId,
        isRead: false,
      },
      data: {
        isRead: true,
        readAt: new Date(),
      },
    });

    return { modifiedCount: result.count };
  }

  private mapNotificationResponse(notification: any): Notification {
    return {
      id: notification.id,
      userId: notification.userId,
      type: notification.type,
      title: notification.title,
      message: notification.message,
      data: notification.data,
      isRead: notification.isRead,
      readAt: notification.readAt?.toISOString(),
      createdAt: notification.createdAt.toISOString(),
    };
  }
}
