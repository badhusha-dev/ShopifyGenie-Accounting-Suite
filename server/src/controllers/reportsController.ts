import { Request, Response } from 'express';
import { prisma } from '../config/database';
import { logger } from '../utils/logger';

export const getTrialBalance = async (req: Request, res: Response) => {
  try {
    const { asOfDate } = req.query;
    const date = asOfDate ? new Date(asOfDate as string) : new Date();

    // Get all accounts with their balances
    const accounts = await prisma.account.findMany({
      where: { isActive: true },
      include: {
        journalLines: {
          where: {
            journalEntry: {
              isPosted: true,
              date: { lte: date },
            },
          },
        },
      },
      orderBy: { code: 'asc' },
    });

    const trialBalance = accounts.map(account => {
      const totalDebit = account.journalLines.reduce((sum, line) => sum + Number(line.debit), 0);
      const totalCredit = account.journalLines.reduce((sum, line) => sum + Number(line.credit), 0);
      const balance = totalDebit - totalCredit;

      return {
        accountId: account.id,
        accountCode: account.code,
        accountName: account.name,
        debit: totalDebit,
        credit: totalCredit,
        balance,
      };
    });

    // Calculate totals
    const totalDebits = trialBalance.reduce((sum, item) => sum + item.debit, 0);
    const totalCredits = trialBalance.reduce((sum, item) => sum + item.credit, 0);

    res.json({
      success: true,
      data: {
        trialBalance,
        totals: {
          totalDebits,
          totalCredits,
          difference: totalDebits - totalCredits,
        },
        asOfDate: date,
      },
    });
  } catch (error) {
    logger.error('Get trial balance error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to generate trial balance',
    });
  }
};

export const getProfitLoss = async (req: Request, res: Response) => {
  try {
    const { startDate, endDate } = req.query;
    const start = startDate ? new Date(startDate as string) : new Date(new Date().getFullYear(), 0, 1);
    const end = endDate ? new Date(endDate as string) : new Date();

    // Get revenue accounts
    const revenueAccounts = await prisma.account.findMany({
      where: {
        type: 'REVENUE',
        isActive: true,
      },
      include: {
        journalLines: {
          where: {
            journalEntry: {
              isPosted: true,
              date: { gte: start, lte: end },
            },
          },
        },
      },
    });

    // Get expense accounts
    const expenseAccounts = await prisma.account.findMany({
      where: {
        type: { in: ['EXPENSE', 'COST_OF_GOODS_SOLD'] },
        isActive: true,
      },
      include: {
        journalLines: {
          where: {
            journalEntry: {
              isPosted: true,
              date: { gte: start, lte: end },
            },
          },
        },
      },
    });

    // Calculate revenue
    const revenue = revenueAccounts.map(account => {
      const totalCredit = account.journalLines.reduce((sum, line) => sum + Number(line.credit), 0);
      const totalDebit = account.journalLines.reduce((sum, line) => sum + Number(line.debit), 0);
      const amount = totalCredit - totalDebit;

      return {
        accountId: account.id,
        accountCode: account.code,
        accountName: account.name,
        amount,
        type: 'REVENUE' as const,
      };
    });

    // Calculate expenses
    const expenses = expenseAccounts.map(account => {
      const totalDebit = account.journalLines.reduce((sum, line) => sum + Number(line.debit), 0);
      const totalCredit = account.journalLines.reduce((sum, line) => sum + Number(line.credit), 0);
      const amount = totalDebit - totalCredit;

      return {
        accountId: account.id,
        accountCode: account.code,
        accountName: account.name,
        amount,
        type: account.type === 'COST_OF_GOODS_SOLD' ? 'COGS' as const : 'EXPENSE' as const,
      };
    });

    // Calculate totals
    const totalRevenue = revenue.reduce((sum, item) => sum + item.amount, 0);
    const totalExpenses = expenses.reduce((sum, item) => sum + item.amount, 0);
    const grossProfit = totalRevenue - expenses.filter(e => e.type === 'COGS').reduce((sum, item) => sum + item.amount, 0);
    const netProfit = totalRevenue - totalExpenses;

    res.json({
      success: true,
      data: {
        revenue,
        expenses,
        totals: {
          totalRevenue,
          totalExpenses,
          grossProfit,
          netProfit,
        },
        period: {
          startDate: start,
          endDate: end,
        },
      },
    });
  } catch (error) {
    logger.error('Get profit loss error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to generate profit & loss statement',
    });
  }
};

export const getBalanceSheet = async (req: Request, res: Response) => {
  try {
    const { asOfDate } = req.query;
    const date = asOfDate ? new Date(asOfDate as string) : new Date();

    // Get assets
    const assets = await prisma.account.findMany({
      where: {
        type: 'ASSET',
        isActive: true,
      },
      include: {
        journalLines: {
          where: {
            journalEntry: {
              isPosted: true,
              date: { lte: date },
            },
          },
        },
      },
      orderBy: { code: 'asc' },
    });

    // Get liabilities
    const liabilities = await prisma.account.findMany({
      where: {
        type: 'LIABILITY',
        isActive: true,
      },
      include: {
        journalLines: {
          where: {
            journalEntry: {
              isPosted: true,
              date: { lte: date },
            },
          },
        },
      },
      orderBy: { code: 'asc' },
    });

    // Get equity
    const equity = await prisma.account.findMany({
      where: {
        type: 'EQUITY',
        isActive: true,
      },
      include: {
        journalLines: {
          where: {
            journalEntry: {
              isPosted: true,
              date: { lte: date },
            },
          },
        },
      },
      orderBy: { code: 'asc' },
    });

    // Calculate balances
    const calculateBalance = (account: any) => {
      const totalDebit = account.journalLines.reduce((sum: number, line: any) => sum + Number(line.debit), 0);
      const totalCredit = account.journalLines.reduce((sum: number, line: any) => sum + Number(line.credit), 0);
      return totalDebit - totalCredit;
    };

    const assetBalances = assets.map(account => ({
      accountId: account.id,
      accountCode: account.code,
      accountName: account.name,
      amount: calculateBalance(account),
      type: 'ASSET' as const,
    }));

    const liabilityBalances = liabilities.map(account => ({
      accountId: account.id,
      accountCode: account.code,
      accountName: account.name,
      amount: calculateBalance(account),
      type: 'LIABILITY' as const,
    }));

    const equityBalances = equity.map(account => ({
      accountId: account.id,
      accountCode: account.code,
      accountName: account.name,
      amount: calculateBalance(account),
      type: 'EQUITY' as const,
    }));

    // Calculate totals
    const totalAssets = assetBalances.reduce((sum, item) => sum + item.amount, 0);
    const totalLiabilities = liabilityBalances.reduce((sum, item) => sum + item.amount, 0);
    const totalEquity = equityBalances.reduce((sum, item) => sum + item.amount, 0);

    res.json({
      success: true,
      data: {
        assets: assetBalances,
        liabilities: liabilityBalances,
        equity: equityBalances,
        totals: {
          totalAssets,
          totalLiabilities,
          totalEquity,
          totalLiabilitiesAndEquity: totalLiabilities + totalEquity,
        },
        asOfDate: date,
      },
    });
  } catch (error) {
    logger.error('Get balance sheet error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to generate balance sheet',
    });
  }
};

export const getTaxSummary = async (req: Request, res: Response) => {
  try {
    const { startDate, endDate } = req.query;
    const start = startDate ? new Date(startDate as string) : new Date(new Date().getFullYear(), 0, 1);
    const end = endDate ? new Date(endDate as string) : new Date();

    // Get tax-related accounts
    const taxAccounts = await prisma.account.findMany({
      where: {
        name: {
          contains: 'tax',
        },
        isActive: true,
      },
      include: {
        journalLines: {
          where: {
            journalEntry: {
              isPosted: true,
              date: { gte: start, lte: end },
            },
          },
        },
      },
    });

    const taxSummary = taxAccounts.map((account: any) => {
      const totalDebit = account.journalLines.reduce((sum, line) => sum + Number(line.debit), 0);
      const totalCredit = account.journalLines.reduce((sum, line) => sum + Number(line.credit), 0);
      const balance = totalDebit - totalCredit;

      return {
        accountId: account.id,
        accountCode: account.code,
        accountName: account.name,
        collected: totalCredit,
        paid: totalDebit,
        balance,
      };
    });

    const totalCollected = taxSummary.reduce((sum, item) => sum + item.collected, 0);
    const totalPaid = taxSummary.reduce((sum, item) => sum + item.paid, 0);
    const netTaxOwed = totalCollected - totalPaid;

    res.json({
      success: true,
      data: {
        taxSummary,
        totals: {
          totalCollected,
          totalPaid,
          netTaxOwed,
        },
        period: {
          startDate: start,
          endDate: end,
        },
      },
    });
  } catch (error) {
    logger.error('Get tax summary error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to generate tax summary',
    });
  }
};

export const getDashboardStats = async (req: Request, res: Response) => {
  try {
    const [
      totalRevenue,
      totalOrders,
      totalCustomers,
      pendingReconciliation,
      lastSyncAt,
    ] = await Promise.all([
      // Total revenue from sales
      prisma.journalEntry.aggregate({
        where: {
          isPosted: true,
          lines: {
            some: {
              account: {
                type: 'REVENUE',
              },
            },
          },
        },
        _sum: {
          totalCredit: true,
        },
      }),
      // Total orders
      prisma.shopifyOrder.count(),
      // Total customers (unique emails)
      prisma.shopifyOrder.groupBy({
        by: ['customerEmail'],
        where: {
          customerEmail: { not: null },
        },
      }),
      // Pending reconciliation
      prisma.reconciliationMatch.count({
        where: {
          isMatched: false,
        },
      }),
      // Last sync time
      prisma.shopifyStore.findFirst({
        orderBy: { lastSyncAt: 'desc' },
        select: { lastSyncAt: true },
      }),
    ]);

    res.json({
      success: true,
      data: {
        totalRevenue: Number(totalRevenue._sum.totalCredit || 0),
        totalOrders,
        totalCustomers: totalCustomers.length,
        pendingReconciliation,
        lastSyncAt: lastSyncAt?.lastSyncAt,
      },
    });
  } catch (error) {
    logger.error('Get dashboard stats error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get dashboard statistics',
    });
  }
};

// Advanced Reports
import { 
  getCashFlowIndirect, 
  getTaxSummary as getTaxSummaryService, 
  getExpenseBreakdown as getExpenseBreakdownService,
  getRevenueBreakdown
} from '../services/reportService';

export const getCashFlow = async (req: Request, res: Response) => {
  try {
    const { from, to } = req.query as any;
    const data = await getCashFlowIndirect(from, to);
    
    res.json({
      success: true,
      data,
    });
  } catch (error) {
    logger.error('Get cash flow error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to generate cash flow statement',
    });
  }
};

export const getTaxSummaryCtrl = async (req: Request, res: Response) => {
  try {
    const { from, to } = req.query as any;
    const data = await getTaxSummaryService(from, to);
    
    res.json({
      success: true,
      data,
    });
  } catch (error) {
    logger.error('Get tax summary error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to generate tax summary',
    });
  }
};

export const getExpenseBreakdownCtrl = async (req: Request, res: Response) => {
  try {
    const { from, to, top } = req.query as any;
    const data = await getExpenseBreakdownService(from, to, top ? Number(top) : 10);
    
    res.json({
      success: true,
      data,
    });
  } catch (error) {
    logger.error('Get expense breakdown error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to generate expense breakdown',
    });
  }
};

export const getRevenueBreakdownCtrl = async (req: Request, res: Response) => {
  try {
    const { from, to, top } = req.query as any;
    const data = await getRevenueBreakdown(from, to, top ? Number(top) : 10);
    
    res.json({
      success: true,
      data,
    });
  } catch (error) {
    logger.error('Get revenue breakdown error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to generate revenue breakdown',
    });
  }
};
