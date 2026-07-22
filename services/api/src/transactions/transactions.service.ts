import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import prisma from '../prisma';
import {
  Transaction,
  TransactionCreateDto,
  TransactionFilterDto,
  PaginatedResponse,
  TransactionType,
  TransactionStatus,
} from '@whitebank/types';

@Injectable()
export class TransactionsService {
  async createTransaction(
    userId: string,
    createTransactionDto: TransactionCreateDto,
  ): Promise<Transaction> {
    // Verify account ownership
    const account = await prisma.account.findFirst({
      where: {
        id: createTransactionDto.accountId,
        userId,
      },
    });

    if (!account) {
      throw new NotFoundException('Account not found');
    }

    // Check sufficient balance for withdrawals
    if (
      createTransactionDto.type === TransactionType.WITHDRAWAL &&
      account.balance < BigInt(createTransactionDto.amount)
    ) {
      throw new BadRequestException('Insufficient balance');
    }

    // Update account balance
    const amount = BigInt(createTransactionDto.amount);
    const newBalance =
      createTransactionDto.type === TransactionType.DEPOSIT
        ? account.balance + amount
        : account.balance - amount;

    const transaction = await prisma.transaction.create({
      data: {
        accountId: createTransactionDto.accountId,
        userId,
        amount: createTransactionDto.amount,
        type: createTransactionDto.type,
        description: createTransactionDto.description,
        merchant: createTransactionDto.merchant,
        category: createTransactionDto.category,
        status: TransactionStatus.COMPLETED,
      },
    });

    // Update account balance
    await prisma.account.update({
      where: { id: createTransactionDto.accountId },
      data: { balance: newBalance },
    });

    return this.mapTransactionResponse(transaction);
  }

  async getAccountTransactions(
    accountId: string,
    userId: string,
    limit: number,
    offset: number,
  ): Promise<PaginatedResponse<Transaction>> {
    // Verify account ownership
    const account = await prisma.account.findFirst({
      where: {
        id: accountId,
        userId,
      },
    });

    if (!account) {
      throw new NotFoundException('Account not found');
    }

    const [transactions, total] = await Promise.all([
      prisma.transaction.findMany({
        where: { accountId },
        orderBy: { createdAt: 'desc' },
        take: limit,
        skip: offset,
      }),
      prisma.transaction.count({ where: { accountId } }),
    ]);

    return {
      data: transactions.map((tx) => this.mapTransactionResponse(tx)),
      total,
      page: Math.floor(offset / limit) + 1,
      limit,
      hasMore: offset + limit < total,
    };
  }

  async getTransaction(
    transactionId: string,
    userId: string,
  ): Promise<Transaction> {
    const transaction = await prisma.transaction.findFirst({
      where: {
        id: transactionId,
        userId,
      },
    });

    if (!transaction) {
      throw new NotFoundException('Transaction not found');
    }

    return this.mapTransactionResponse(transaction);
  }

  async getTransactionHistory(
    accountId: string,
    userId: string,
    filterDto: TransactionFilterDto,
    limit: number,
    offset: number,
  ): Promise<PaginatedResponse<Transaction>> {
    // Verify account ownership
    const account = await prisma.account.findFirst({
      where: {
        id: accountId,
        userId,
      },
    });

    if (!account) {
      throw new NotFoundException('Account not found');
    }

    const where: any = { accountId };

    if (filterDto.startDate || filterDto.endDate) {
      where.createdAt = {};
      if (filterDto.startDate) {
        where.createdAt.gte = new Date(filterDto.startDate);
      }
      if (filterDto.endDate) {
        where.createdAt.lte = new Date(filterDto.endDate);
      }
    }

    if (filterDto.type) {
      where.type = filterDto.type;
    }

    if (filterDto.status) {
      where.status = filterDto.status;
    }

    const [transactions, total] = await Promise.all([
      prisma.transaction.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        take: limit,
        skip: offset,
      }),
      prisma.transaction.count({ where }),
    ]);

    return {
      data: transactions.map((tx) => this.mapTransactionResponse(tx)),
      total,
      page: Math.floor(offset / limit) + 1,
      limit,
      hasMore: offset + limit < total,
    };
  }

  private mapTransactionResponse(transaction: any): Transaction {
    return {
      id: transaction.id,
      accountId: transaction.accountId,
      userId: transaction.userId,
      amount: transaction.amount.toString(),
      type: transaction.type,
      status: transaction.status,
      description: transaction.description,
      reference: transaction.reference,
      merchant: transaction.merchant,
      category: transaction.category,
      createdAt: transaction.createdAt.toISOString(),
    };
  }
}
