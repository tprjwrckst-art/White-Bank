import {
  Controller,
  Get,
  UseGuards,
  Request,
  Query,
} from '@nestjs/common';
import { ActivityLogsService } from './activity-logs.service';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import {
  ActivityLog,
  PaginatedResponse,
} from '@whitebank/types';

@Controller('activity-logs')
@UseGuards(JwtAuthGuard)
export class ActivityLogsController {
  constructor(private activityLogsService: ActivityLogsService) {}

  @Get()
  async getUserActivityLogs(
    @Query('limit') limit: number = 50,
    @Query('offset') offset: number = 0,
    @Request() req,
  ): Promise<PaginatedResponse<ActivityLog>> {
    return this.activityLogsService.getUserActivityLogs(
      req.user.id,
      limit,
      offset,
    );
  }
}
