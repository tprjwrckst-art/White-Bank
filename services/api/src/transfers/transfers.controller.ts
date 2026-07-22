import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  UseGuards,
  Request,
  Query,
} from '@nestjs/common';
import { TransfersService } from './transfers.service';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import {
  Transfer,
  TransferCreateDto,
  TransferListDto,
  PaginatedResponse,
} from '@whitebank/types';

@Controller('transfers')
@UseGuards(JwtAuthGuard)
export class TransfersController {
  constructor(private transfersService: TransfersService) {}

  @Post()
  async initiateTransfer(
    @Body() createTransferDto: TransferCreateDto,
    @Request() req,
  ): Promise<Transfer> {
    return this.transfersService.initiateTransfer(
      req.user.id,
      createTransferDto,
    );
  }

  @Get('sent')
  async getSentTransfers(
    @Query('limit') limit: number = 20,
    @Query('offset') offset: number = 0,
    @Request() req,
  ): Promise<PaginatedResponse<Transfer>> {
    return this.transfersService.getSentTransfers(req.user.id, limit, offset);
  }

  @Get('received')
  async getReceivedTransfers(
    @Query('limit') limit: number = 20,
    @Query('offset') offset: number = 0,
    @Request() req,
  ): Promise<PaginatedResponse<Transfer>> {
    return this.transfersService.getReceivedTransfers(
      req.user.id,
      limit,
      offset,
    );
  }

  @Get(':id')
  async getTransfer(
    @Param('id') transferId: string,
    @Request() req,
  ): Promise<Transfer> {
    return this.transfersService.getTransfer(transferId, req.user.id);
  }

  @Post(':id/cancel')
  async cancelTransfer(
    @Param('id') transferId: string,
    @Request() req,
  ): Promise<Transfer> {
    return this.transfersService.cancelTransfer(transferId, req.user.id);
  }
}
