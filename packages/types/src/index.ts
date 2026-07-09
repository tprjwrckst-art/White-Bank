export type ID = string;

export enum Role {
  CUSTOMER = 'CUSTOMER',
  ADMIN = 'ADMIN',
}

export interface User {
  id: ID;
  email: string;
  passwordHash?: string; // present on server only
  isEmailVerified: boolean;
  twoFactorEnabled?: boolean;
  roles: Role[];
  createdAt: string; // ISO date
  updatedAt: string; // ISO date
}

export interface Account {
  id: ID;
  userId: ID;
  name: string;
  type: 'CHECKING' | 'SAVINGS' | 'LOAN' | 'VIRTUAL';
  currency: string; // ISO currency code, e.g. USD
  balance: string; // decimal as string to avoid precision loss
  createdAt: string;
  updatedAt: string;
}

export type TransactionType = 'CREDIT' | 'DEBIT';

export interface Transaction {
  id: ID;
  accountId: ID;
  amount: string; // decimal as string
  type: TransactionType;
  description?: string;
  metadata?: Record<string, unknown>;
  createdAt: string;
  balanceAfter?: string;
}

export interface AuthPayload {
  accessToken: string;
  refreshToken: string;
  expiresIn: number; // seconds
  user: Pick<User, 'id' | 'email' | 'roles'>;
}
