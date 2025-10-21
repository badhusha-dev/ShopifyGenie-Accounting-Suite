import { api } from './api'
import { DashboardStats, TrialBalanceItem, PnLItem, BalanceSheetItem } from '@shopifygenie/shared'

export interface DashboardStatsResponse {
  success: boolean
  data: DashboardStats
}

export interface TrialBalanceResponse {
  success: boolean
  data: {
    trialBalance: TrialBalanceItem[]
    totals: {
      totalDebits: number
      totalCredits: number
      difference: number
    }
    asOfDate: string
  }
}

export interface PnLResponse {
  success: boolean
  data: {
    revenue: PnLItem[]
    expenses: PnLItem[]
    totals: {
      totalRevenue: number
      totalExpenses: number
      grossProfit: number
      netProfit: number
    }
    period: {
      startDate: string
      endDate: string
    }
  }
}

export interface BalanceSheetResponse {
  success: boolean
  data: {
    assets: BalanceSheetItem[]
    liabilities: BalanceSheetItem[]
    equity: BalanceSheetItem[]
    totals: {
      totalAssets: number
      totalLiabilities: number
      totalEquity: number
      totalLiabilitiesAndEquity: number
    }
    asOfDate: string
  }
}

export const reportsService = {
  getDashboardStats: async (): Promise<DashboardStatsResponse> => {
    const response = await api.get('/reports/dashboard')
    return response.data
  },

  getTrialBalance: async (asOfDate?: string): Promise<TrialBalanceResponse> => {
    const params = asOfDate ? { asOfDate } : {}
    const response = await api.get('/reports/trial-balance', { params })
    return response.data
  },

  getProfitLoss: async (startDate?: string, endDate?: string): Promise<PnLResponse> => {
    const params: any = {}
    if (startDate) params.startDate = startDate
    if (endDate) params.endDate = endDate
    const response = await api.get('/reports/pnl', { params })
    return response.data
  },

  getBalanceSheet: async (asOfDate?: string): Promise<BalanceSheetResponse> => {
    const params = asOfDate ? { asOfDate } : {}
    const response = await api.get('/reports/balance-sheet', { params })
    return response.data
  },

  getTaxSummary: async (startDate?: string, endDate?: string) => {
    const params: any = {}
    if (startDate) params.startDate = startDate
    if (endDate) params.endDate = endDate
    const response = await api.get('/reports/tax-summary', { params })
    return response.data
  },
}
