import { Injectable, ForbiddenException, NotFoundException } from '@nestjs/common';
import prisma from '../prisma';
import {
  Account,
  AccountCreateDto,
  AccountUpdateDto,
} from '@whitebank/types';
import { generateAccountNumber } from '../utils/account.utils';

@Injectable()
export class AccountsService {
  async createAccount(
    userId: string,
    createAccountDto: AccountCreateDto,
  ): Promise<Account> {
    const accountNumber = await generateAccountNumber();

    const account = await prisma.account.create({
      data: {
        userId,
        accountNumber,
        accountName: createAccountDto.accountName,
        accountType: createAccountDto.accountType,
        currency: createAccountDto.currency || 'USD',
      },
    });

    return this.mapAccountResponse(account);
  }

  async getUserAccounts(userId: string): Promise<Account[]> {
    const accounts = await prisma.account.findMany({
      where: { userId },
    });

    return accounts.map((account) => this.mapAccountResponse(account));
  }

  async getAccountById(accountId: string, userId: string): Promise<Account> {
    const account = await prisma.account.findFirst({
      where: {
        id: accountId,
        userId,
      },
    });

    if (!account) {
      throw new NotFoundException('Account not found');
    }

    return this.mapAccountResponse(account);
  }

  async updateAccount(
    accountId: string,
    userId: string,
    updateAccountDto: AccountUpdateDto,
  ): Promise<Account> {
    const account = await prisma.account.findFirst({
      where: {
        id: accountId,
        userId,
      },
    });

    if (!account) {
      throw new NotFoundException('Account not found');
    }

    const updatedAccount = await prisma.account.update({
      where: { id: accountId },
      data: {
        ...(updateAccountDto.accountName && {
          accountName: updateAccountDto.accountName,
        }),
        ...(updateAccountDto.status && { status: updateAccountDto.status }),
      },
    });

    return this.mapAccountResponse(updatedAccount);
  }

  async getAccountBalance(
    accountId: string,
    userId: string,
  ): Promise<{ balance: string; currency: string }> {
    const account = await this.getAccountById(accountId, userId);

    return {
      balance: account.balance,
      currency: account.currency,
    };
  }

  private mapAccountResponse(account: any): Account {
    return {
      id: account.id,
      userId: account.userId,
      accountNumber: account.accountNumber,
      accountType: account.accountType,
      accountName: account.accountName,
      balance: account.balance.toString(),
      currency: account.currency,
      status: account.status,
      interestRate: account.interestRate?.toString(),
      createdAt: account.createdAt.toISOString(),
      updatedAt: account.updatedAt.toISOString(),
    };
  }
}
