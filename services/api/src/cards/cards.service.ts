import { Injectable, NotFoundException } from '@nestjs/common';
import prisma from '../prisma';
import { Card, CardCreateDto, CardUpdateDto, CardStatus } from '@whitebank/types';
import { generateCardNumber } from '../utils/card.utils';

@Injectable()
export class CardsService {
  async createCard(
    userId: string,
    createCardDto: CardCreateDto,
  ): Promise<Card> {
    // Verify account ownership
    const account = await prisma.account.findFirst({
      where: {
        id: createCardDto.accountId,
        userId,
      },
    });

    if (!account) {
      throw new NotFoundException('Account not found');
    }

    const cardNumber = await generateCardNumber();
    const cvv = this.generateCVV();

    const card = await prisma.card.create({
      data: {
        userId,
        accountId: createCardDto.accountId,
        cardNumber,
        cvv,
        cardType: createCardDto.cardType,
        cardBrand: createCardDto.cardBrand,
        cardholderName: createCardDto.cardholderName,
        expiryMonth: createCardDto.expiryMonth,
        expiryYear: createCardDto.expiryYear,
        isVirtual: createCardDto.isVirtual || false,
      },
    });

    return this.mapCardResponse(card);
  }

  async getUserCards(userId: string): Promise<Card[]> {
    const cards = await prisma.card.findMany({
      where: { userId },
    });

    return cards.map((card) => this.mapCardResponse(card));
  }

  async getCard(cardId: string, userId: string): Promise<Card> {
    const card = await prisma.card.findFirst({
      where: {
        id: cardId,
        userId,
      },
    });

    if (!card) {
      throw new NotFoundException('Card not found');
    }

    return this.mapCardResponse(card);
  }

  async updateCard(
    cardId: string,
    userId: string,
    updateCardDto: CardUpdateDto,
  ): Promise<Card> {
    const card = await prisma.card.findFirst({
      where: {
        id: cardId,
        userId,
      },
    });

    if (!card) {
      throw new NotFoundException('Card not found');
    }

    const updatedCard = await prisma.card.update({
      where: { id: cardId },
      data: {
        ...(updateCardDto.status && { status: updateCardDto.status }),
        ...(updateCardDto.dailyLimit && {
          dailyLimit: updateCardDto.dailyLimit,
        }),
        ...(updateCardDto.monthlyLimit && {
          monthlyLimit: updateCardDto.monthlyLimit,
        }),
        ...(updateCardDto.isPrimary !== undefined && {
          isPrimary: updateCardDto.isPrimary,
        }),
      },
    });

    return this.mapCardResponse(updatedCard);
  }

  async activateCard(cardId: string, userId: string): Promise<Card> {
    const card = await prisma.card.findFirst({
      where: {
        id: cardId,
        userId,
      },
    });

    if (!card) {
      throw new NotFoundException('Card not found');
    }

    const updatedCard = await prisma.card.update({
      where: { id: cardId },
      data: {
        status: CardStatus.ACTIVE,
        activatedAt: new Date(),
      },
    });

    return this.mapCardResponse(updatedCard);
  }

  async blockCard(cardId: string, userId: string): Promise<Card> {
    const card = await prisma.card.findFirst({
      where: {
        id: cardId,
        userId,
      },
    });

    if (!card) {
      throw new NotFoundException('Card not found');
    }

    const updatedCard = await prisma.card.update({
      where: { id: cardId },
      data: {
        status: CardStatus.BLOCKED,
      },
    });

    return this.mapCardResponse(updatedCard);
  }

  private mapCardResponse(card: any): Card {
    return {
      id: card.id,
      userId: card.userId,
      accountId: card.accountId,
      cardNumber: this.maskCardNumber(card.cardNumber),
      cardType: card.cardType,
      cardBrand: card.cardBrand,
      cardholderName: card.cardholderName,
      expiryMonth: card.expiryMonth,
      expiryYear: card.expiryYear,
      status: card.status,
      dailyLimit: card.dailyLimit.toString(),
      monthlyLimit: card.monthlyLimit.toString(),
      isVirtual: card.isVirtual,
      isPrimary: card.isPrimary,
      issuedAt: card.issuedAt.toISOString(),
      activatedAt: card.activatedAt?.toISOString(),
      deactivatedAt: card.deactivatedAt?.toISOString(),
      createdAt: card.createdAt.toISOString(),
      updatedAt: card.updatedAt.toISOString(),
    };
  }

  private maskCardNumber(cardNumber: string): string {
    const last4 = cardNumber.slice(-4);
    return `****-****-****-${last4}`;
  }

  private generateCVV(): string {
    return Math.floor(100 + Math.random() * 900).toString();
  }
}
