export type ID = string;

// ============================================
// USER & AUTHENTICATION
// ============================================

export enum UserRole {
  CUSTOMER = 'CUSTOMER',
  SUPPORT = 'SUPPORT',
  ADMIN = 'ADMIN',
}

export enum UserStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  SUSPENDED = 'SUSPENDED',
  DELETED = 'DELETED',
}

export enum KYCStatus {
  PENDING = 'PENDING',
  UNDER_REVIEW = 'UNDER_REVIEW',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
}

export interface User {
  id: ID;
  email: string;
  name: string;
  phone?: string;
  dateOfBirth?: string; // ISO date
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  country?: string;
  kycStatus: KYCStatus;
  kycVerifiedAt?: string; // ISO date
  role: UserRole;
  status: UserStatus;
  lastLoginAt?: string; // ISO date
  emailVerified: boolean;
  emailVerifiedAt?: string; // ISO date
  createdAt: string; // ISO date
  updatedAt: string; // ISO date
}

export interface UserCreateDto {
  email: string;
  password: string;
  name: string;
  phone?: string;
}

export interface UserUpdateDto {
  name?: string;
  phone?: string;
  dateOfBirth?: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  country?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  user: User;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: number; // seconds
}

// ============================================
// ACCOUNT
// ============================================

export enum AccountType {
  SAVINGS = 'SAVINGS',
  CHECKING = 'CHECKING',
  INVESTMENT = 'INVESTMENT',
  LOAN = 'LOAN',
}

export enum AccountStatus {
  ACTIVE = 'ACTIVE',
  FROZEN = 'FROZEN',
  CLOSED = 'CLOSED',
}

export interface Account {
  id: ID;
  userId: ID;
  accountNumber: string;
  accountType: AccountType;
  accountName: string;
  balance: string; // decimal as string to avoid precision loss
  currency: string; // ISO currency code
  status: AccountStatus;
  interestRate?: string; // decimal as string
  createdAt: string; // ISO date
  updatedAt: string; // ISO date
}

export interface AccountCreateDto {
  accountName: string;
  accountType: AccountType;
  currency?: string;
}

export interface AccountUpdateDto {
  accountName?: string;
  status?: AccountStatus;
}

// ============================================
// TRANSACTION
// ============================================

export enum TransactionType {
  DEPOSIT = 'DEPOSIT',
  WITHDRAWAL = 'WITHDRAWAL',
  TRANSFER = 'TRANSFER',
  PURCHASE = 'PURCHASE',
  REFUND = 'REFUND',
  INTEREST_CREDIT = 'INTEREST_CREDIT',
  FEE_DEBIT = 'FEE_DEBIT',
}

export enum TransactionStatus {
  PENDING = 'PENDING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
  CANCELLED = 'CANCELLED',
  REVERSED = 'REVERSED',
}

export interface Transaction {
  id: ID;
  accountId: ID;
  userId: ID;
  amount: string; // decimal as string
  type: TransactionType;
  status: TransactionStatus;
  description?: string;
  reference?: string;
  merchant?: string;
  category?: string;
  createdAt: string; // ISO date
}

export interface TransactionCreateDto {
  accountId: string;
  amount: string;
  type: TransactionType;
  description?: string;
  merchant?: string;
  category?: string;
}

export interface TransactionFilterDto {
  startDate?: string;
  endDate?: string;
  type?: TransactionType;
  status?: TransactionStatus;
  minAmount?: string;
  maxAmount?: string;
}

// ============================================
// TRANSFER
// ============================================

export enum TransferStatus {
  PENDING = 'PENDING',
  PROCESSING = 'PROCESSING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
  CANCELLED = 'CANCELLED',
}

export interface Transfer {
  id: ID;
  senderAccountId: ID;
  senderId: ID;
  receiverAccountId: ID;
  receiverId: ID;
  amount: string; // decimal as string
  purpose?: string;
  status: TransferStatus;
  processedAt?: string; // ISO date
  createdAt: string; // ISO date
  updatedAt: string; // ISO date
}

export interface TransferCreateDto {
  receiverAccountId: string;
  amount: string;
  purpose?: string;
}

export interface TransferListDto {
  limit?: number;
  offset?: number;
  status?: TransferStatus;
}

// ============================================
// CARD
// ============================================

export enum CardType {
  DEBIT = 'DEBIT',
  CREDIT = 'CREDIT',
}

export enum CardBrand {
  VISA = 'VISA',
  MASTERCARD = 'MASTERCARD',
  AMEX = 'AMEX',
}

export enum CardStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  BLOCKED = 'BLOCKED',
  EXPIRED = 'EXPIRED',
}

export interface Card {
  id: ID;
  userId: ID;
  accountId: ID;
  cardNumber: string; // masked or encrypted
  cardType: CardType;
  cardBrand: CardBrand;
  cardholderName: string;
  expiryMonth: number;
  expiryYear: number;
  status: CardStatus;
  dailyLimit: string; // decimal as string
  monthlyLimit: string; // decimal as string
  isVirtual: boolean;
  isPrimary: boolean;
  issuedAt: string; // ISO date
  activatedAt?: string; // ISO date
  deactivatedAt?: string; // ISO date
  createdAt: string; // ISO date
  updatedAt: string; // ISO date
}

export interface CardCreateDto {
  accountId: string;
  cardType: CardType;
  cardBrand: CardBrand;
  cardholderName: string;
  expiryMonth: number;
  expiryYear: number;
  isVirtual?: boolean;
}

export interface CardUpdateDto {
  status?: CardStatus;
  dailyLimit?: string;
  monthlyLimit?: string;
  isPrimary?: boolean;
}

// ============================================
// LOAN
// ============================================

export enum LoanStatus {
  PENDING = 'PENDING',
  ACTIVE = 'ACTIVE',
  COMPLETED = 'COMPLETED',
  DEFAULTED = 'DEFAULTED',
}

export interface Loan {
  id: ID;
  userId: ID;
  accountId: ID;
  principalAmount: string; // decimal as string
  interestRate: string; // decimal as string
  loanTerm: number; // in months
  monthlyPayment: string; // decimal as string
  status: LoanStatus;
  disbursedAt?: string; // ISO date
  dueDate: string; // ISO date
  createdAt: string; // ISO date
  updatedAt: string; // ISO date
}

export interface LoanCreateDto {
  accountId: string;
  principalAmount: string;
  interestRate: string;
  loanTerm: number;
}

// ============================================
// NOTIFICATION
// ============================================

export enum NotificationType {
  TRANSACTION = 'TRANSACTION',
  TRANSFER = 'TRANSFER',
  CARD = 'CARD',
  ACCOUNT = 'ACCOUNT',
  SECURITY = 'SECURITY',
  PROMOTION = 'PROMOTION',
}

export interface Notification {
  id: ID;
  userId: ID;
  type: NotificationType;
  title: string;
  message: string;
  data?: Record<string, unknown>;
  isRead: boolean;
  readAt?: string; // ISO date
  createdAt: string; // ISO date
}

export interface NotificationUpdateDto {
  isRead: boolean;
}

// ============================================
// FRAUD & SECURITY
// ============================================

export enum AlertSeverity {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  CRITICAL = 'CRITICAL',
}

export enum AlertStatus {
  OPEN = 'OPEN',
  IN_REVIEW = 'IN_REVIEW',
  RESOLVED = 'RESOLVED',
  FALSE_POSITIVE = 'FALSE_POSITIVE',
}

export interface FraudAlert {
  id: ID;
  transactionId?: string;
  userId: ID;
  alertType: string;
  severity: AlertSeverity;
  description: string;
  status: AlertStatus;
  resolvedAt?: string; // ISO date
  createdAt: string; // ISO date
}

// ============================================
// ACTIVITY LOG
// ============================================

export interface ActivityLog {
  id: ID;
  userId: ID;
  action: string;
  resource: string;
  resourceId?: string;
  details?: Record<string, unknown>;
  ipAddress?: string;
  userAgent?: string;
  createdAt: string; // ISO date
}

// ============================================
// API RESPONSE TYPES
// ============================================

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  statusCode: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}

export interface ApiError {
  message: string;
  statusCode: number;
  errors?: Record<string, string>;
}
