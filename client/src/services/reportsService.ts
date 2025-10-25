import axios from 'axios';

const api = axios.create({
  baseURL: '/api/reports',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token interceptor
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export interface DashboardData {
  totalRevenue: number;
  totalExpenses: number;
  netIncome: number;
  totalAssets: number;
  totalLiabilities: number;
  totalEquity: number;
  totalOrders: number;
  totalCustomers: number;
}

export interface TrialBalanceItem {
  accountId: string;
  accountCode: string;
  accountName: string;
  debit: number;
  credit: number;
  balance: number;
}

export interface ProfitLossItem {
  category: string;
  accounts: Array<{
    accountId: string;
    accountName: string;
    amount: number;
  }>;
  total: number;
}

export interface BalanceSheetSection {
  category: string;
  accounts: Array<{
    accountId: string;
    accountName: string;
    balance: number;
  }>;
  total: number;
}

export const reportsService = {
  // Get dashboard summary
  getDashboard: async (): Promise<DashboardData> => {
    const { data } = await api.get('/dashboard');
    return data.data || data;
  },

  // Get trial balance
  getTrialBalance: async (asOfDate?: string) => {
    const { data } = await api.get('/trial-balance', {
      params: asOfDate ? { asOfDate } : {},
    });
    return data.data || data;
  },

  // Get profit & loss statement
  getProfitLoss: async (startDate?: string, endDate?: string) => {
    const { data } = await api.get('/profit-loss', {
      params: {
        ...(startDate && { startDate }),
        ...(endDate && { endDate }),
      },
    });
    return data.data || data;
  },

  // Get balance sheet
  getBalanceSheet: async (asOfDate?: string) => {
    const { data } = await api.get('/balance-sheet', {
      params: asOfDate ? { asOfDate } : {},
    });
    return data.data || data;
  },

  // Get tax summary
  getTaxSummary: async (startDate?: string, endDate?: string) => {
    const { data } = await api.get('/tax-summary', {
      params: {
        ...(startDate && { startDate }),
        ...(endDate && { endDate }),
      },
    });
    return data.data || data;
  },

  // Get cash flow statement
  getCashFlow: async (from?: string, to?: string) => {
    const { data } = await api.get('/cashflow', {
      params: {
        ...(from && { from }),
        ...(to && { to }),
      },
    });
    return data.data || data;
  },

  // Get tax detailed summary
  getTaxDetailed: async (from?: string, to?: string) => {
    const { data } = await api.get('/tax', {
      params: {
        ...(from && { from }),
        ...(to && { to }),
      },
    });
    return data.data || data;
  },

  // Get expense breakdown
  getExpenseBreakdown: async (from?: string, to?: string, top?: number) => {
    const { data } = await api.get('/expense-breakdown', {
      params: {
        ...(from && { from }),
        ...(to && { to }),
        ...(top && { top }),
      },
    });
    return data.data || data;
  },

  // Get revenue breakdown
  getRevenueBreakdown: async (from?: string, to?: string, top?: number) => {
    const { data } = await api.get('/revenue-breakdown', {
      params: {
        ...(from && { from }),
        ...(to && { to }),
        ...(top && { top }),
      },
    });
    return data.data || data;
  },
};
