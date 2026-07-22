import {
  Controller,
  Get,
  Post,
  Put,
  Param,
  Body,
  UseGuards,
  Request,
  Query,
} from '@nestjs/common';
import { AccountsService } from './accounts.service';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import {
  Account,
  AccountCreateDto,
  AccountUpdateDto,
  PaginatedResponse,
} from '@whitebank/types';

@Controller('accounts')
@UseGuards(JwtAuthGuard)
export class AccountsController {
  constructor(private accountsService: AccountsService) {}

  @Post()
  async createAccount(
    @Body() createAccountDto: AccountCreateDto,
    @Request() req,
  ): Promise<Account> {
    return this.accountsService.createAccount(req.user.id, createAccountDto);
  }

  @Get()
  async getUserAccounts(@Request() req): Promise<Account[]> {
    return this.accountsService.getUserAccounts(req.user.id);
  }

  @Get(':id')
  async getAccountById(
    @Param('id') accountId: string,
    @Request() req,
  ): Promise<Account> {
    return this.accountsService.getAccountById(accountId, req.user.id);
  }

  @Put(':id')
  async updateAccount(
    @Param('id') accountId: string,
    @Body() updateAccountDto: AccountUpdateDto,
    @Request() req,
  ): Promise<Account> {
    return this.accountsService.updateAccount(
      accountId,
      req.user.id,
      updateAccountDto,
    );
  }

  @Get(':id/balance')
  async getAccountBalance(
    @Param('id') accountId: string,
    @Request() req,
  ): Promise<{ balance: string; currency: string }> {
    return this.accountsService.getAccountBalance(accountId, req.user.id);
  }
}
