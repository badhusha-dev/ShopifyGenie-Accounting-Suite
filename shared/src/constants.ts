// ===== USER ROLES =====
export const USER_ROLES = {
  SUPER_ADMIN: 'SUPER_ADMIN',
  ACCOUNTING: 'ACCOUNTING',
  SHOPIFY_MANAGER: 'SHOPIFY_MANAGER',
  AUDITOR: 'AUDITOR',
} as const;

// ===== ACCOUNT TYPES =====
export const ACCOUNT_TYPES = {
  ASSET: 'ASSET',
  LIABILITY: 'LIABILITY',
  EQUITY: 'EQUITY',
  REVENUE: 'REVENUE',
  EXPENSE: 'EXPENSE',
  COST_OF_GOODS_SOLD: 'COST_OF_GOODS_SOLD',
} as const;

// ===== SHOPIFY SCOPES =====
export const SHOPIFY_SCOPES = [
  'read_orders',
  'read_products',
  'read_customers',
  'read_inventory',
  'read_refunds',
  'shopify_payments_payouts',
] as const;

// ===== SHOPIFY WEBHOOK TOPICS =====
export const SHOPIFY_WEBHOOK_TOPICS = {
  ORDERS_PAID: 'orders/paid',
  ORDERS_FULFILLED: 'orders/fulfilled',
  REFUNDS_CREATE: 'refunds/create',
  INVENTORY_LEVELS_UPDATE: 'inventory_levels/update',
} as const;

// ===== DEFAULT CHART OF ACCOUNTS =====
export const DEFAULT_ACCOUNTS = [
  // ASSETS
  { code: '1000', name: 'Cash and Cash Equivalents', type: 'ASSET' },
  { code: '1100', name: 'Accounts Receivable', type: 'ASSET' },
  { code: '1200', name: 'Inventory', type: 'ASSET' },
  { code: '1300', name: 'Prepaid Expenses', type: 'ASSET' },
  { code: '1400', name: 'Fixed Assets', type: 'ASSET' },
  { code: '1500', name: 'Accumulated Depreciation', type: 'ASSET' },

  // LIABILITIES
  { code: '2000', name: 'Accounts Payable', type: 'LIABILITY' },
  { code: '2100', name: 'Accrued Expenses', type: 'LIABILITY' },
  { code: '2200', name: 'Sales Tax Payable', type: 'LIABILITY' },
  { code: '2300', name: 'Shopify Fees Payable', type: 'LIABILITY' },

  // EQUITY
  { code: '3000', name: 'Owner\'s Equity', type: 'EQUITY' },
  { code: '3100', name: 'Retained Earnings', type: 'EQUITY' },

  // REVENUE
  { code: '4000', name: 'Sales Revenue', type: 'REVENUE' },
  { code: '4100', name: 'Shipping Revenue', type: 'REVENUE' },
  { code: '4200', name: 'Other Income', type: 'REVENUE' },

  // EXPENSES
  { code: '5000', name: 'Cost of Goods Sold', type: 'COST_OF_GOODS_SOLD' },
  { code: '5100', name: 'Shopify Fees', type: 'EXPENSE' },
  { code: '5200', name: 'Payment Processing Fees', type: 'EXPENSE' },
  { code: '5300', name: 'Shipping Costs', type: 'EXPENSE' },
  { code: '5400', name: 'Marketing Expenses', type: 'EXPENSE' },
  { code: '5500', name: 'General & Administrative', type: 'EXPENSE' },
] as const;

// ===== POSTING RULES =====
export const POSTING_RULES = {
  ORDER_PAID: {
    debit: '1000', // Cash
    credit: '4000', // Sales Revenue
  },
  REFUND_PROCESSED: {
    debit: '4000', // Sales Revenue (negative)
    credit: '1000', // Cash
  },
  SHOPIFY_FEE: {
    debit: '5100', // Shopify Fees
    credit: '2300', // Shopify Fees Payable
  },
  COGS: {
    debit: '5000', // Cost of Goods Sold
    credit: '1200', // Inventory
  },
} as const;

// ===== API ENDPOINTS =====
export const API_ENDPOINTS = {
  // Auth
  LOGIN: '/auth/login',
  REGISTER: '/auth/register',
  ME: '/auth/me',
  REFRESH: '/auth/refresh',

  // Shopify
  SHOPIFY_INSTALL: '/shopify/install',
  SHOPIFY_CALLBACK: '/shopify/callback',
  SHOPIFY_SYNC: '/shopify/sync',
  SHOPIFY_WEBHOOKS: '/shopify/webhooks',

  // Accounting
  ACCOUNTS: '/accounting/accounts',
  JOURNAL_ENTRIES: '/accounting/journals',
  JOURNAL_LINES: '/accounting/journal-lines',

  // Reports
  TRIAL_BALANCE: '/reports/trial-balance',
  PROFIT_LOSS: '/reports/pnl',
  BALANCE_SHEET: '/reports/balance-sheet',
  TAX_SUMMARY: '/reports/tax-summary',

  // Reconciliation
  RECONCILIATION: '/reconciliation',
  RECONCILIATION_MATCH: '/reconciliation/match',
} as const;

// ===== PAGINATION =====
export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 20,
  MAX_LIMIT: 100,
} as const;

// ===== DATE FORMATS =====
export const DATE_FORMATS = {
  ISO: 'YYYY-MM-DD',
  DISPLAY: 'MMM DD, YYYY',
  DATETIME: 'MMM DD, YYYY HH:mm',
} as const;

// ===== CURRENCIES =====
export const SUPPORTED_CURRENCIES = [
  'USD', 'CAD', 'EUR', 'GBP', 'AUD', 'JPY', 'CHF', 'SEK', 'NOK', 'DKK',
] as const;

// ===== FILE UPLOAD =====
export const FILE_UPLOAD = {
  MAX_SIZE: 10 * 1024 * 1024, // 10MB
  ALLOWED_TYPES: ['image/jpeg', 'image/png', 'image/gif', 'application/pdf'],
} as const;

// ===== RATE LIMITING =====
export const RATE_LIMITS = {
  WINDOW_MS: 15 * 60 * 1000, // 15 minutes
  MAX_REQUESTS: 100,
  LOGIN_MAX_ATTEMPTS: 5,
  LOGIN_LOCKOUT_DURATION: 15 * 60 * 1000, // 15 minutes
} as const;

// ===== ERROR CODES =====
export const ERROR_CODES = {
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  AUTHENTICATION_ERROR: 'AUTHENTICATION_ERROR',
  AUTHORIZATION_ERROR: 'AUTHORIZATION_ERROR',
  NOT_FOUND: 'NOT_FOUND',
  CONFLICT: 'CONFLICT',
  INTERNAL_ERROR: 'INTERNAL_ERROR',
  SHOPIFY_ERROR: 'SHOPIFY_ERROR',
  DATABASE_ERROR: 'DATABASE_ERROR',
} as const;

// ===== LOG LEVELS =====
export const LOG_LEVELS = {
  ERROR: 'error',
  WARN: 'warn',
  INFO: 'info',
  DEBUG: 'debug',
} as const;
