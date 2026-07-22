import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import prisma from '../prisma';
import {
  Transfer,
  TransferCreateDto,
  TransferStatus,
  PaginatedResponse,
} from '@whitebank/types';

@Injectable()
export class TransfersService {
  async initiateTransfer(
    senderId: string,
    createTransferDto: TransferCreateDto,
  ): Promise<Transfer> {
    // Get sender's account
    const senderAccount = await prisma.account.findFirst({
      where: {
        id: createTransferDto.receiverAccountId,
        userId: senderId,
      },
    });

    if (!senderAccount) {
      throw new NotFoundException('Sender account not found');
    }

    // Get receiver's account
    const receiverAccount = await prisma.account.findUnique({
      where: { id: createTransferDto.receiverAccountId },
    });

    if (!receiverAccount) {
      throw new NotFoundException('Receiver account not found');
    }

    // Check sufficient balance
    if (
      senderAccount.balance <
      BigInt(createTransferDto.amount)
    ) {
      throw new BadRequestException('Insufficient balance for transfer');
    }

    // Create transfer record
    const transfer = await prisma.transfer.create({
      data: {
        senderAccountId: senderAccount.id,
        senderId,
        receiverAccountId: receiverAccount.id,
        receiverId: receiverAccount.userId,
        amount: createTransferDto.amount,
        purpose: createTransferDto.purpose,
        status: TransferStatus.PROCESSING,
      },
    });

    // Process transfer - deduct from sender
    await prisma.account.update({
      where: { id: senderAccount.id },
      data: {
        balance:
          senderAccount.balance -
          BigInt(createTransferDto.amount),
      },
    });

    // Add to receiver
    await prisma.account.update({
      where: { id: receiverAccount.id },
      data: {
        balance:
          receiverAccount.balance +
          BigInt(createTransferDto.amount),
      },
    });

    // Mark transfer as completed
    const completedTransfer = await prisma.transfer.update({
      where: { id: transfer.id },
      data: {
        status: TransferStatus.COMPLETED,
        processedAt: new Date(),
      },
    });

    return this.mapTransferResponse(completedTransfer);
  }

  async getSentTransfers(
    senderId: string,
    limit: number,
    offset: number,
  ): Promise<PaginatedResponse<Transfer>> {
    const [transfers, total] = await Promise.all([
      prisma.transfer.findMany({
        where: { senderId },
        orderBy: { createdAt: 'desc' },
        take: limit,
        skip: offset,
      }),
      prisma.transfer.count({ where: { senderId } }),
    ]);

    return {
      data: transfers.map((t) => this.mapTransferResponse(t)),
      total,
      page: Math.floor(offset / limit) + 1,
      limit,
      hasMore: offset + limit < total,
    };
  }

  async getReceivedTransfers(
    receiverId: string,
    limit: number,
    offset: number,
  ): Promise<PaginatedResponse<Transfer>> {
    const [transfers, total] = await Promise.all([
      prisma.transfer.findMany({
        where: { receiverId },
        orderBy: { createdAt: 'desc' },
        take: limit,
        skip: offset,
      }),
      prisma.transfer.count({ where: { receiverId } }),
    ]);

    return {
      data: transfers.map((t) => this.mapTransferResponse(t)),
      total,
      page: Math.floor(offset / limit) + 1,
      limit,
      hasMore: offset + limit < total,
    };
  }

  async getTransfer(transferId: string, userId: string): Promise<Transfer> {
    const transfer = await prisma.transfer.findFirst({
      where: {
        id: transferId,
        OR: [{ senderId: userId }, { receiverId: userId }],
      },
    });

    if (!transfer) {
      throw new NotFoundException('Transfer not found');
    }

    return this.mapTransferResponse(transfer);
  }

  async cancelTransfer(transferId: string, userId: string): Promise<Transfer> {
    const transfer = await prisma.transfer.findFirst({
      where: {
        id: transferId,
        senderId: userId,
        status: TransferStatus.PENDING,
      },
    });

    if (!transfer) {
      throw new NotFoundException(
        'Transfer not found or cannot be cancelled',
      );
    }

    // Revert balance changes
    const [senderAccount, receiverAccount] = await Promise.all([
      prisma.account.findUnique({
        where: { id: transfer.senderAccountId },
      }),
      prisma.account.findUnique({
        where: { id: transfer.receiverAccountId },
      }),
    ]);

    await Promise.all([
      prisma.account.update({
        where: { id: transfer.senderAccountId },
        data: {
          balance: senderAccount!.balance + BigInt(transfer.amount),
        },
      }),
      prisma.account.update({
        where: { id: transfer.receiverAccountId },
        data: {
          balance: receiverAccount!.balance - BigInt(transfer.amount),
        },
      }),
    ]);

    // Update transfer status
    const cancelledTransfer = await prisma.transfer.update({
      where: { id: transferId },
      data: { status: TransferStatus.CANCELLED },
    });

    return this.mapTransferResponse(cancelledTransfer);
  }

  private mapTransferResponse(transfer: any): Transfer {
    return {
      id: transfer.id,
      senderAccountId: transfer.senderAccountId,
      senderId: transfer.senderId,
      receiverAccountId: transfer.receiverAccountId,
      receiverId: transfer.receiverId,
      amount: transfer.amount.toString(),
      purpose: transfer.purpose,
      status: transfer.status,
      processedAt: transfer.processedAt?.toISOString(),
      createdAt: transfer.createdAt.toISOString(),
      updatedAt: transfer.updatedAt.toISOString(),
    };
  }
}
