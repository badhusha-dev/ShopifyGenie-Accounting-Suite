import { prisma } from '../config/database';
import { subMonths, startOfMonth, endOfMonth } from 'date-fns';
import { logger } from '../utils/logger';

/**
 * Cash Flow Statement - Indirect Method
 * Steps:
 *  - Start with Net Income (Revenue - Expense) for period
 *  - Adjust for non-cash items: depreciation, amortization
 *  - Adjust for changes in working capital: AR, AP, Inventory changes
 */
export async function getCashFlowIndirect(from?: string, to?: string) {
  try {
    const start = from ? new Date(from) : startOfMonth(subMonths(new Date(), 0));
    const end = to ? new Date(to) : endOfMonth(new Date());

    // Net income (Revenue - Expense)
    const revenueLines = await prisma.journalLine.findMany({
      where: {
        journalEntry: { 
          isPosted: true,
          date: { gte: start, lte: end } 
        },
        account: { type: 'REVENUE' },
      },
      include: { account: true },
    });

    const expenseLines = await prisma.journalLine.findMany({
      where: {
        journalEntry: { 
          isPosted: true,
          date: { gte: start, lte: end } 
        },
        account: { type: { in: ['EXPENSE', 'COST_OF_GOODS_SOLD'] } },
      },
      include: { account: true },
    });

    const sum = (lines: any[]) =>
      lines.reduce((s, l) => s + (Number(l.debit || 0) - Number(l.credit || 0)), 0);

    const totalRevenue = Math.abs(sum(revenueLines)); // revenue is usually credits
    const totalExpense = sum(expenseLines);
    const netIncome = totalRevenue - totalExpense;

    // Non-cash adjustments (depreciation/amortization)
    const nonCashLines = await prisma.journalLine.findMany({
      where: {
        journalEntry: { 
          isPosted: true,
          date: { gte: start, lte: end } 
        },
        account: { 
          OR: [
            { name: { contains: 'Depreciation' } },
            { name: { contains: 'Amortization' } }
          ] 
        },
      },
      include: { account: true },
    });
    const nonCashAdjustment = nonCashLines.reduce(
      (s, l) => s + (Number(l.debit || 0) - Number(l.credit || 0)), 
      0
    );

    // Working capital changes helper
    async function getBalanceAsOf(accountType: string, date: Date, nameFilter?: string) {
      const where: any = { type: accountType };
      if (nameFilter) {
        where.name = { contains: nameFilter };
      }
      
      const accounts = await prisma.account.findMany({ where });
      const accountIds = accounts.map((a) => a.id);
      
      if (accountIds.length === 0) return 0;
      
      const lines = await prisma.journalLine.findMany({
        where: {
          accountId: { in: accountIds },
          journalEntry: {
            isPosted: true,
            date: { lte: date }
          }
        },
      });
      
      return lines.reduce((s, l) => s + (Number(l.debit || 0) - Number(l.credit || 0)), 0);
    }

    // Accounts Receivable (Asset accounts with "Receivable" in name)
    const startAR = await getBalanceAsOf('ASSET', new Date(start.getTime() - 1), 'Receivable');
    const endAR = await getBalanceAsOf('ASSET', end, 'Receivable');
    const changeAR = endAR - startAR;

    // Accounts Payable (Liability accounts with "Payable" in name)
    const startAP = await getBalanceAsOf('LIABILITY', new Date(start.getTime() - 1), 'Payable');
    const endAP = await getBalanceAsOf('LIABILITY', end, 'Payable');
    const changeAP = endAP - startAP;

    // Inventory (Asset accounts with "Inventory" in name)
    const startInv = await getBalanceAsOf('ASSET', new Date(start.getTime() - 1), 'Inventory');
    const endInv = await getBalanceAsOf('ASSET', end, 'Inventory');
    const changeInventory = endInv - startInv;

    // Compose statement
    const operatingActivities = {
      netIncome,
      adjustments: nonCashAdjustment,
      changesInWorkingCapital: {
        accountsReceivable: -changeAR, // increase in AR => use of cash
        accountsPayable: changeAP,     // increase in AP => source of cash
        inventory: -changeInventory,   // increase in inventory => use of cash
      }
    };

    const netCashFromOperations = 
      operatingActivities.netIncome + 
      operatingActivities.adjustments +
      operatingActivities.changesInWorkingCapital.accountsReceivable +
      operatingActivities.changesInWorkingCapital.accountsPayable +
      operatingActivities.changesInWorkingCapital.inventory;

    // Investing & financing activities (simplified - can be enhanced)
    const investing = { purchases: 0, sales: 0 };
    const financing = { loans: 0, equity: 0 };

    return {
      period: { start, end },
      operatingActivities,
      netCashFromOperations,
      investing,
      financing,
      netChangeInCash: netCashFromOperations + investing.purchases + investing.sales + financing.loans + financing.equity
    };
  } catch (error) {
    logger.error('Get cash flow error:', error);
    throw error;
  }
}

/**
 * Tax Summary
 * Aggregate taxes from:
 *  1. Shopify order taxLines (preferred)
 *  2. Journal lines hitting Tax accounts
 */
export async function getTaxSummary(from?: string, to?: string) {
  try {
    const start = from ? new Date(from) : startOfMonth(new Date());
    const end = to ? new Date(to) : endOfMonth(new Date());

    // 1) Aggregate from Shopify orders
    const orders = await prisma.shopifyOrder.findMany({
      where: { 
        createdAt: { gte: start, lte: end }
      },
      select: {
        totalTax: true,
        totalPrice: true,
        currency: true,
      }
    });

    // Aggregate tax from orders
    const byJurisdiction: Record<string, number> = {};
    let totalTaxFromShopify = 0;

    for (const order of orders) {
      const taxAmount = Number(order.totalTax || 0);
      totalTaxFromShopify += taxAmount;
      
      // Group by currency for now (can be enhanced with jurisdiction data)
      const key = `${order.currency} Tax`;
      byJurisdiction[key] = (byJurisdiction[key] || 0) + taxAmount;
    }

    // 2) Aggregate from Journal Lines hitting Tax accounts
    const taxAccounts = await prisma.account.findMany({ 
      where: { 
        OR: [
          { name: { contains: 'Tax' } },
          { code: { contains: 'TAX' } }
        ]
      }
    });

    const taxFromJournals: Record<string, number> = {};
    let totalTaxFromJournals = 0;

    if (taxAccounts.length > 0) {
      const taxAccountIds = taxAccounts.map(a => a.id);
      const lines = await prisma.journalLine.findMany({
        where: {
          accountId: { in: taxAccountIds },
          journalEntry: {
            isPosted: true,
            date: { gte: start, lte: end }
          }
        },
        include: { account: true }
      });

      for (const line of lines) {
        const acctName = line.account.name;
        const amt = Number(line.credit || 0) - Number(line.debit || 0);
        taxFromJournals[acctName] = (taxFromJournals[acctName] || 0) + amt;
        totalTaxFromJournals += amt;
      }
    }

    return { 
      period: { start, end }, 
      byJurisdiction, 
      taxFromJournals,
      totalTaxCollected: totalTaxFromShopify + totalTaxFromJournals,
      taxFromShopify: totalTaxFromShopify,
      taxFromJournalEntries: totalTaxFromJournals,
    };
  } catch (error) {
    logger.error('Get tax summary error:', error);
    throw error;
  }
}

/**
 * Expense Breakdown
 * Group expense accounts and show top N categories
 */
export async function getExpenseBreakdown(from?: string, to?: string, top: number = 10) {
  try {
    const start = from ? new Date(from) : startOfMonth(new Date());
    const end = to ? new Date(to) : endOfMonth(new Date());

    const lines = await prisma.journalLine.findMany({
      where: {
        journalEntry: {
          isPosted: true,
          date: { gte: start, lte: end }
        },
        account: { type: { in: ['EXPENSE', 'COST_OF_GOODS_SOLD'] } }
      },
      include: { account: true }
    });

    const map: Record<string, number> = {};
    
    for (const line of lines) {
      const acctName = line.account.name;
      const amt = Number(line.debit || 0) - Number(line.credit || 0); // expenses usually debit
      map[acctName] = (map[acctName] || 0) + amt;
    }

    const arr = Object.entries(map).map(([name, amount]) => ({ 
      name, 
      amount,
      percentage: 0 // will calculate after total
    }));
    
    arr.sort((a, b) => Math.abs(b.amount) - Math.abs(a.amount));
    
    const total = arr.reduce((s, r) => s + Math.abs(r.amount), 0);
    
    // Calculate percentages
    arr.forEach(item => {
      item.percentage = total > 0 ? (Math.abs(item.amount) / total) * 100 : 0;
    });

    return { 
      period: { start, end }, 
      total, 
      breakdown: arr.slice(0, top),
      fullBreakdown: arr
    };
  } catch (error) {
    logger.error('Get expense breakdown error:', error);
    throw error;
  }
}

/**
 * Revenue Breakdown (similar to expense breakdown)
 */
export async function getRevenueBreakdown(from?: string, to?: string, top: number = 10) {
  try {
    const start = from ? new Date(from) : startOfMonth(new Date());
    const end = to ? new Date(to) : endOfMonth(new Date());

    const lines = await prisma.journalLine.findMany({
      where: {
        journalEntry: {
          isPosted: true,
          date: { gte: start, lte: end }
        },
        account: { type: 'REVENUE' }
      },
      include: { account: true }
    });

    const map: Record<string, number> = {};
    
    for (const line of lines) {
      const acctName = line.account.name;
      const amt = Number(line.credit || 0) - Number(line.debit || 0); // revenue usually credit
      map[acctName] = (map[acctName] || 0) + amt;
    }

    const arr = Object.entries(map).map(([name, amount]) => ({ 
      name, 
      amount,
      percentage: 0
    }));
    
    arr.sort((a, b) => Math.abs(b.amount) - Math.abs(a.amount));
    
    const total = arr.reduce((s, r) => s + Math.abs(r.amount), 0);
    
    arr.forEach(item => {
      item.percentage = total > 0 ? (Math.abs(item.amount) / total) * 100 : 0;
    });

    return { 
      period: { start, end }, 
      total, 
      breakdown: arr.slice(0, top),
      fullBreakdown: arr
    };
  } catch (error) {
    logger.error('Get revenue breakdown error:', error);
    throw error;
  }
}

