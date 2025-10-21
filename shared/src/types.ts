import { z } from 'zod';

// ===== USER & AUTHENTICATION =====
export const UserRoleSchema = z.enum(['SUPER_ADMIN', 'ACCOUNTING', 'SHOPIFY_MANAGER', 'AUDITOR']);
export type UserRole = z.infer<typeof UserRoleSchema>;

export const UserSchema = z.object({
  id: z.string(),
  email: z.string().email(),
  name: z.string(),
  role: UserRoleSchema,
  isActive: z.boolean(),
  createdAt: z.date(),
  updatedAt: z.date(),
});
export type User = z.infer<typeof UserSchema>;

export const LoginRequestSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});
export type LoginRequest = z.infer<typeof LoginRequestSchema>;

export const RegisterRequestSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  name: z.string().min(2),
  role: UserRoleSchema.optional(),
});
export type RegisterRequest = z.infer<typeof RegisterRequestSchema>;

// ===== SHOPIFY INTEGRATION =====
export const ShopifyStoreSchema = z.object({
  id: z.string(),
  shopDomain: z.string(),
  accessToken: z.string(),
  scope: z.string(),
  isActive: z.boolean(),
  lastSyncAt: z.date().optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
});
export type ShopifyStore = z.infer<typeof ShopifyStoreSchema>;

export const ShopifyOrderSchema = z.object({
  id: z.string(),
  shopifyOrderId: z.string(),
  orderNumber: z.string(),
  customerId: z.string().optional(),
  customerEmail: z.string().optional(),
  totalPrice: z.number(),
  subtotalPrice: z.number(),
  totalTax: z.number(),
  currency: z.string(),
  financialStatus: z.string(),
  fulfillmentStatus: z.string(),
  processedAt: z.date().optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
});
export type ShopifyOrder = z.infer<typeof ShopifyOrderSchema>;

export const ShopifyRefundSchema = z.object({
  id: z.string(),
  shopifyRefundId: z.string(),
  orderId: z.string(),
  amount: z.number(),
  currency: z.string(),
  reason: z.string().optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
});
export type ShopifyRefund = z.infer<typeof ShopifyRefundSchema>;

export const ShopifyPayoutSchema = z.object({
  id: z.string(),
  shopifyPayoutId: z.string(),
  amount: z.number(),
  currency: z.string(),
  status: z.string(),
  processedAt: z.date().optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
});
export type ShopifyPayout = z.infer<typeof ShopifyPayoutSchema>;

// ===== ACCOUNTING =====
export const AccountTypeSchema = z.enum([
  'ASSET',
  'LIABILITY',
  'EQUITY',
  'REVENUE',
  'EXPENSE',
  'COST_OF_GOODS_SOLD'
]);
export type AccountType = z.infer<typeof AccountTypeSchema>;

export const AccountSchema = z.object({
  id: z.string(),
  code: z.string(),
  name: z.string(),
  type: AccountTypeSchema,
  parentId: z.string().optional(),
  isActive: z.boolean(),
  createdAt: z.date(),
  updatedAt: z.date(),
});
export type Account = z.infer<typeof AccountSchema>;

export const JournalEntrySchema = z.object({
  id: z.string(),
  reference: z.string(),
  description: z.string(),
  date: z.date(),
  totalDebit: z.number(),
  totalCredit: z.number(),
  isPosted: z.boolean(),
  postedAt: z.date().optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
});
export type JournalEntry = z.infer<typeof JournalEntrySchema>;

export const JournalLineSchema = z.object({
  id: z.string(),
  journalEntryId: z.string(),
  accountId: z.string(),
  debit: z.number(),
  credit: z.number(),
  description: z.string().optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
});
export type JournalLine = z.infer<typeof JournalLineSchema>;

// ===== RECONCILIATION =====
export const ReconciliationMatchSchema = z.object({
  id: z.string(),
  payoutId: z.string(),
  orderId: z.string(),
  amount: z.number(),
  isMatched: z.boolean(),
  matchedAt: z.date().optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
});
export type ReconciliationMatch = z.infer<typeof ReconciliationMatchSchema>;

// ===== REPORTS =====
export const TrialBalanceItemSchema = z.object({
  accountId: z.string(),
  accountCode: z.string(),
  accountName: z.string(),
  debit: z.number(),
  credit: z.number(),
  balance: z.number(),
});
export type TrialBalanceItem = z.infer<typeof TrialBalanceItemSchema>;

export const PnLItemSchema = z.object({
  accountId: z.string(),
  accountCode: z.string(),
  accountName: z.string(),
  amount: z.number(),
  type: z.enum(['REVENUE', 'EXPENSE', 'COGS']),
});
export type PnLItem = z.infer<typeof PnLItemSchema>;

export const BalanceSheetItemSchema = z.object({
  accountId: z.string(),
  accountCode: z.string(),
  accountName: z.string(),
  amount: z.number(),
  type: z.enum(['ASSET', 'LIABILITY', 'EQUITY']),
});
export type BalanceSheetItem = z.infer<typeof BalanceSheetItemSchema>;

// ===== API RESPONSES =====
export const ApiResponseSchema = z.object({
  success: z.boolean(),
  message: z.string().optional(),
  data: z.any().optional(),
  error: z.string().optional(),
});
export type ApiResponse<T = any> = {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
};

export const PaginatedResponseSchema = z.object({
  data: z.array(z.any()),
  pagination: z.object({
    page: z.number(),
    limit: z.number(),
    total: z.number(),
    totalPages: z.number(),
  }),
});
export type PaginatedResponse<T = any> = {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
};

// ===== WEBHOOKS =====
export const WebhookEventSchema = z.object({
  id: z.string(),
  topic: z.string(),
  shop_domain: z.string(),
  data: z.any(),
  created_at: z.string(),
});
export type WebhookEvent = z.infer<typeof WebhookEventSchema>;

// ===== DASHBOARD =====
export const DashboardStatsSchema = z.object({
  totalRevenue: z.number(),
  totalOrders: z.number(),
  totalCustomers: z.number(),
  pendingReconciliation: z.number(),
  lastSyncAt: z.date().optional(),
});
export type DashboardStats = z.infer<typeof DashboardStatsSchema>;
