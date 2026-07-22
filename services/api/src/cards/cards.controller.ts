import {
  Controller,
  Get,
  Post,
  Put,
  Param,
  Body,
  UseGuards,
  Request,
} from '@nestjs/common';
import { CardsService } from './cards.service';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { Card, CardCreateDto, CardUpdateDto } from '@whitebank/types';

@Controller('cards')
@UseGuards(JwtAuthGuard)
export class CardsController {
  constructor(private cardsService: CardsService) {}

  @Post()
  async createCard(
    @Body() createCardDto: CardCreateDto,
    @Request() req,
  ): Promise<Card> {
    return this.cardsService.createCard(req.user.id, createCardDto);
  }

  @Get()
  async getUserCards(@Request() req): Promise<Card[]> {
    return this.cardsService.getUserCards(req.user.id);
  }

  @Get(':id')
  async getCard(
    @Param('id') cardId: string,
    @Request() req,
  ): Promise<Card> {
    return this.cardsService.getCard(cardId, req.user.id);
  }

  @Put(':id')
  async updateCard(
    @Param('id') cardId: string,
    @Body() updateCardDto: CardUpdateDto,
    @Request() req,
  ): Promise<Card> {
    return this.cardsService.updateCard(cardId, req.user.id, updateCardDto);
  }

  @Post(':id/activate')
  async activateCard(
    @Param('id') cardId: string,
    @Request() req,
  ): Promise<Card> {
    return this.cardsService.activateCard(cardId, req.user.id);
  }

  @Post(':id/block')
  async blockCard(
    @Param('id') cardId: string,
    @Request() req,
  ): Promise<Card> {
    return this.cardsService.blockCard(cardId, req.user.id);
  }
}
