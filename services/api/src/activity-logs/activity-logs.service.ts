import { Injectable } from '@nestjs/common';
import prisma from '../prisma';
import {
  ActivityLog,
  PaginatedResponse,
} from '@whitebank/types';

@Injectable()
export class ActivityLogsService {
  async createLog(
    userId: string,
    action: string,
    resource: string,
    resourceId?: string,
    details?: Record<string, any>,
    ipAddress?: string,
    userAgent?: string,
  ): Promise<ActivityLog> {
    const log = await prisma.activityLog.create({
      data: {
        userId,
        action,
        resource,
        resourceId,
        details: details || {},
        ipAddress,
        userAgent,
      },
    });

    return this.mapLogResponse(log);
  }

  async getUserActivityLogs(
    userId: string,
    limit: number = 50,
    offset: number = 0,
  ): Promise<PaginatedResponse<ActivityLog>> {
    const [logs, total] = await Promise.all([
      prisma.activityLog.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        take: limit,
        skip: offset,
      }),
      prisma.activityLog.count({ where: { userId } }),
    ]);

    return {
      data: logs.map((log) => this.mapLogResponse(log)),
      total,
      page: Math.floor(offset / limit) + 1,
      limit,
      hasMore: offset + limit < total,
    };
  }

  async getResourceActivityLogs(
    resource: string,
    resourceId: string,
    limit: number = 50,
    offset: number = 0,
  ): Promise<PaginatedResponse<ActivityLog>> {
    const [logs, total] = await Promise.all([
      prisma.activityLog.findMany({
        where: { resource, resourceId },
        orderBy: { createdAt: 'desc' },
        take: limit,
        skip: offset,
      }),
      prisma.activityLog.count({ where: { resource, resourceId } }),
    ]);

    return {
      data: logs.map((log) => this.mapLogResponse(log)),
      total,
      page: Math.floor(offset / limit) + 1,
      limit,
      hasMore: offset + limit < total,
    };
  }

  private mapLogResponse(log: any): ActivityLog {
    return {
      id: log.id,
      userId: log.userId,
      action: log.action,
      resource: log.resource,
      resourceId: log.resourceId,
      details: log.details,
      ipAddress: log.ipAddress,
      userAgent: log.userAgent,
      createdAt: log.createdAt.toISOString(),
    };
  }
}
