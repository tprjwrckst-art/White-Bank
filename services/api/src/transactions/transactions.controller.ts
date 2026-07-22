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
import { TransactionsService } from './transactions.service';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import {
  Transaction,
  TransactionCreateDto,
  TransactionFilterDto,
  PaginatedResponse,
} from '@whitebank/types';

@Controller('transactions')
@UseGuards(JwtAuthGuard)
export class TransactionsController {
  constructor(private transactionsService: TransactionsService) {}

  @Post()
  async createTransaction(
    @Body() createTransactionDto: TransactionCreateDto,
    @Request() req,
  ): Promise<Transaction> {
    return this.transactionsService.createTransaction(
      req.user.id,
      createTransactionDto,
    );
  }

  @Get('account/:accountId')
  async getAccountTransactions(
    @Param('accountId') accountId: string,
    @Query('limit') limit: number = 20,
    @Query('offset') offset: number = 0,
    @Request() req,
  ): Promise<PaginatedResponse<Transaction>> {
    return this.transactionsService.getAccountTransactions(
      accountId,
      req.user.id,
      limit,
      offset,
    );
  }

  @Get(':id')
  async getTransaction(
    @Param('id') transactionId: string,
    @Request() req,
  ): Promise<Transaction> {
    return this.transactionsService.getTransaction(transactionId, req.user.id);
  }

  @Get('account/:accountId/history')
  async getTransactionHistory(
    @Param('accountId') accountId: string,
    @Query() filterDto: TransactionFilterDto,
    @Query('limit') limit: number = 50,
    @Query('offset') offset: number = 0,
    @Request() req,
  ): Promise<PaginatedResponse<Transaction>> {
    return this.transactionsService.getTransactionHistory(
      accountId,
      req.user.id,
      filterDto,
      limit,
      offset,
    );
  }
}
