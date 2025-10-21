import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// ===== CASH FLOW STATEMENT =====
export const getCashFlowStatement = async (req: Request, res: Response) => {
  try {
    const { startDate, endDate } = req.query;

    const start = startDate ? new Date(startDate as string) : new Date(new Date().getFullYear(), 0, 1);
    const end = endDate ? new Date(endDate as string) : new Date();

    // Get all journal entries in the period
    const entries = await prisma.journalEntry.findMany({
      where: {
        date: {
          gte: start,
          lte: end,
        },
        isPosted: true,
      },
      include: {
        lines: {
          include: {
            account: true,
          },
        },
      },
    });

    // Cash Flow Categories
    const cashFlow = {
      operating: { inflows: 0, outflows: 0, net: 0 },
      investing: { inflows: 0, outflows: 0, net: 0 },
      financing: { inflows: 0, outflows: 0, net: 0 },
      total: 0,
      openingBalance: 0,
      closingBalance: 0,
    };

    // Get opening cash balance
    const cashAccounts = await prisma.account.findMany({
      where: {
        type: 'ASSET',
        name: {
          contains: 'Cash',
        },
      },
      include: {
        journalLines: {
          where: {
            journalEntry: {
              date: { lt: start },
              isPosted: true,
            },
          },
        },
      },
    });

    cashFlow.openingBalance = cashAccounts.reduce((sum, account) => {
      const balance = account.journalLines.reduce(
        (acc, line) => acc + Number(line.debit) - Number(line.credit),
        0
      );
      return sum + balance;
    }, 0);

    // Categorize transactions
    entries.forEach((entry) => {
      entry.lines.forEach((line) => {
        const amount = Number(line.debit) - Number(line.credit);
        const account = line.account;

        // Operating Activities (Revenue, Expenses, AR, AP)
        if (['REVENUE', 'EXPENSE'].includes(account.type)) {
          if (amount > 0) cashFlow.operating.inflows += amount;
          else cashFlow.operating.outflows += Math.abs(amount);
        }

        // Investing Activities (Fixed Assets, Investments)
        if (account.name.includes('Asset') && account.type === 'ASSET') {
          if (amount > 0) cashFlow.investing.inflows += amount;
          else cashFlow.investing.outflows += Math.abs(amount);
        }

        // Financing Activities (Loans, Equity)
        if (['LIABILITY', 'EQUITY'].includes(account.type)) {
          if (amount > 0) cashFlow.financing.inflows += amount;
          else cashFlow.financing.outflows += Math.abs(amount);
        }
      });
    });

    // Calculate net amounts
    cashFlow.operating.net = cashFlow.operating.inflows - cashFlow.operating.outflows;
    cashFlow.investing.net = cashFlow.investing.inflows - cashFlow.investing.outflows;
    cashFlow.financing.net = cashFlow.financing.inflows - cashFlow.financing.outflows;
    cashFlow.total = cashFlow.operating.net + cashFlow.investing.net + cashFlow.financing.net;
    cashFlow.closingBalance = cashFlow.openingBalance + cashFlow.total;

    res.json({
      success: true,
      data: {
        period: { start, end },
        cashFlow,
      },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Failed to generate cash flow statement',
      error: error.message,
    });
  }
};

// ===== AR AGING REPORT =====
export const getARAgingReport = async (req: Request, res: Response) => {
  try {
    const today = new Date();

    const invoices = await prisma.aRInvoice.findMany({
      where: {
        status: {
          in: ['SENT', 'PARTIAL', 'OVERDUE'],
        },
      },
      include: {
        customer: true,
        payments: true,
      },
    });

    const aging = {
      current: 0,      // 0-30 days
      days31_60: 0,    // 31-60 days
      days61_90: 0,    // 61-90 days
      days90Plus: 0,   // 90+ days
      total: 0,
      byCustomer: [] as any[],
    };

    const customerMap = new Map();

    invoices.forEach((invoice) => {
      const daysOverdue = Math.floor(
        (today.getTime() - invoice.dueDate.getTime()) / (1000 * 60 * 60 * 24)
      );

      const paidAmount = invoice.payments.reduce((sum, payment) => sum + Number(payment.amount), 0);
      const outstanding = Number(invoice.totalAmount) - paidAmount;

      if (outstanding <= 0) return;

      // Categorize by age
      if (daysOverdue <= 0) aging.current += outstanding;
      else if (daysOverdue <= 30) aging.current += outstanding;
      else if (daysOverdue <= 60) aging.days31_60 += outstanding;
      else if (daysOverdue <= 90) aging.days61_90 += outstanding;
      else aging.days90Plus += outstanding;

      aging.total += outstanding;

      // Group by customer
      const customerId = invoice.customerId;
      if (!customerMap.has(customerId)) {
        customerMap.set(customerId, {
          customerId,
          customerName: invoice.customer.name,
          current: 0,
          days31_60: 0,
          days61_90: 0,
          days90Plus: 0,
          total: 0,
        });
      }

      const customerAging = customerMap.get(customerId);
      if (daysOverdue <= 30) customerAging.current += outstanding;
      else if (daysOverdue <= 60) customerAging.days31_60 += outstanding;
      else if (daysOverdue <= 90) customerAging.days61_90 += outstanding;
      else customerAging.days90Plus += outstanding;
      customerAging.total += outstanding;
    });

    aging.byCustomer = Array.from(customerMap.values());

    res.json({
      success: true,
      data: aging,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Failed to generate AR aging report',
      error: error.message,
    });
  }
};

// ===== AP AGING REPORT =====
export const getAPAgingReport = async (req: Request, res: Response) => {
  try {
    const today = new Date();

    const bills = await prisma.aPBill.findMany({
      where: {
        status: {
          in: ['UNPAID', 'PARTIAL'],
        },
      },
      include: {
        vendor: true,
        payments: true,
      },
    });

    const aging = {
      current: 0,
      days31_60: 0,
      days61_90: 0,
      days90Plus: 0,
      total: 0,
      byVendor: [] as any[],
    };

    const vendorMap = new Map();

    bills.forEach((bill) => {
      const daysOverdue = Math.floor(
        (today.getTime() - bill.dueDate.getTime()) / (1000 * 60 * 60 * 24)
      );

      const paidAmount = bill.payments.reduce((sum, payment) => sum + Number(payment.amount), 0);
      const outstanding = Number(bill.totalAmount) - paidAmount;

      if (outstanding <= 0) return;

      if (daysOverdue <= 30) aging.current += outstanding;
      else if (daysOverdue <= 60) aging.days31_60 += outstanding;
      else if (daysOverdue <= 90) aging.days61_90 += outstanding;
      else aging.days90Plus += outstanding;

      aging.total += outstanding;

      const vendorId = bill.vendorId;
      if (!vendorMap.has(vendorId)) {
        vendorMap.set(vendorId, {
          vendorId,
          vendorName: bill.vendor.name,
          current: 0,
          days31_60: 0,
          days61_90: 0,
          days90Plus: 0,
          total: 0,
        });
      }

      const vendorAging = vendorMap.get(vendorId);
      if (daysOverdue <= 30) vendorAging.current += outstanding;
      else if (daysOverdue <= 60) vendorAging.days31_60 += outstanding;
      else if (daysOverdue <= 90) vendorAging.days61_90 += outstanding;
      else vendorAging.days90Plus += outstanding;
      vendorAging.total += outstanding;
    });

    aging.byVendor = Array.from(vendorMap.values());

    res.json({
      success: true,
      data: aging,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Failed to generate AP aging report',
      error: error.message,
    });
  }
};

// ===== BUDGET VS ACTUAL =====
export const getBudgetVariance = async (req: Request, res: Response) => {
  try {
    const { fiscalYear, month } = req.query;

    const year = fiscalYear ? parseInt(fiscalYear as string) : new Date().getFullYear();
    const monthNum = month ? parseInt(month as string) : new Date().getMonth() + 1;

    // Get budgets for the period
    const budgets = await prisma.budget.findMany({
      where: {
        fiscalYear: year,
        month: monthNum,
      },
      include: {
        account: true,
      },
    });

    // Get actual amounts from journal entries
    const startDate = new Date(year, monthNum - 1, 1);
    const endDate = new Date(year, monthNum, 0);

    const actuals = await prisma.journalLine.findMany({
      where: {
        journalEntry: {
          date: {
            gte: startDate,
            lte: endDate,
          },
          isPosted: true,
        },
      },
      include: {
        account: true,
      },
    });

    // Calculate actual by account
    const actualMap = new Map();
    actuals.forEach((line) => {
      const accountId = line.accountId;
      const amount = Number(line.debit) - Number(line.credit);
      actualMap.set(accountId, (actualMap.get(accountId) || 0) + amount);
    });

    // Compute variance
    const variance = budgets.map((budget) => {
      const budgetAmount = Number(budget.amount);
      const actualAmount = actualMap.get(budget.accountId) || 0;
      const diff = actualAmount - budgetAmount;
      const percentVariance = budgetAmount !== 0 ? (diff / budgetAmount) * 100 : 0;

      return {
        accountId: budget.accountId,
        accountCode: budget.account.code,
        accountName: budget.account.name,
        budgetAmount,
        actualAmount,
        variance: diff,
        variancePercent: percentVariance,
        status: diff > 0 ? 'OVER' : diff < 0 ? 'UNDER' : 'ON_TARGET',
      };
    });

    const summary = {
      totalBudget: variance.reduce((sum, v) => sum + v.budgetAmount, 0),
      totalActual: variance.reduce((sum, v) => sum + v.actualAmount, 0),
      totalVariance: variance.reduce((sum, v) => sum + v.variance, 0),
    };

    res.json({
      success: true,
      data: {
        period: { year, month: monthNum },
        summary,
        variance,
      },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Failed to generate budget variance report',
      error: error.message,
    });
  }
};

// ===== FIXED ASSETS REGISTER =====
export const getFixedAssetsRegister = async (req: Request, res: Response) => {
  try {
    const assets = await prisma.fixedAsset.findMany({
      include: {
        depreciationSchedule: {
          where: {
            isPosted: true,
          },
          orderBy: {
            month: 'desc',
          },
          take: 1,
        },
      },
    });

    const register = assets.map((asset) => {
      const latestDep = asset.depreciationSchedule[0];
      return {
        id: asset.id,
        assetNumber: asset.assetNumber,
        name: asset.name,
        category: asset.category,
        purchaseDate: asset.purchaseDate,
        purchasePrice: Number(asset.purchasePrice),
        usefulLifeMonths: asset.usefulLifeMonths,
        depreciationMethod: asset.depreciationMethod,
        accumulatedDepreciation: latestDep ? Number(latestDep.accumulated) : 0,
        bookValue: latestDep ? Number(latestDep.bookValue) : Number(asset.purchasePrice),
        location: asset.location,
        status: asset.disposalDate ? 'DISPOSED' : 'ACTIVE',
      };
    });

    const summary = {
      totalAssets: register.length,
      totalCost: register.reduce((sum, a) => sum + a.purchasePrice, 0),
      totalDepreciation: register.reduce((sum, a) => sum + a.accumulatedDepreciation, 0),
      totalBookValue: register.reduce((sum, a) => sum + a.bookValue, 0),
    };

    res.json({
      success: true,
      data: {
        summary,
        assets: register,
      },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Failed to generate fixed assets register',
      error: error.message,
    });
  }
};

// ===== AUDIT TRAIL =====
export const getAuditTrail = async (req: Request, res: Response) => {
  try {
    const { startDate, endDate, userId, tableName, action } = req.query;

    const where: any = {};

    if (startDate || endDate) {
      where.timestamp = {};
      if (startDate) where.timestamp.gte = new Date(startDate as string);
      if (endDate) where.timestamp.lte = new Date(endDate as string);
    }

    if (userId) where.userId = userId as string;
    if (tableName) where.tableName = tableName as string;
    if (action) where.action = action as string;

    const logs = await prisma.auditLog.findMany({
      where,
      orderBy: {
        timestamp: 'desc',
      },
      take: 100,
    });

    const summary = {
      totalEntries: logs.length,
      byAction: {} as any,
      byTable: {} as any,
    };

    logs.forEach((log) => {
      summary.byAction[log.action] = (summary.byAction[log.action] || 0) + 1;
      summary.byTable[log.tableName] = (summary.byTable[log.tableName] || 0) + 1;
    });

    res.json({
      success: true,
      data: {
        summary,
        logs,
      },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve audit trail',
      error: error.message,
    });
  }
};

// ===== INVENTORY VALUATION =====
export const getInventoryValuation = async (req: Request, res: Response) => {
  try {
    const items = await prisma.inventoryItem.findMany({
      include: {
        movements: {
          orderBy: {
            date: 'asc',
          },
        },
      },
    });

    const valuation = items.map((item) => {
      let totalValue = 0;
      let avgCost = 0;

      if (item.valuationMethod === 'FIFO') {
        // FIFO calculation
        const queue: any[] = [];
        item.movements.forEach((movement) => {
          if (movement.type === 'IN') {
            queue.push({ qty: movement.quantity, cost: Number(movement.unitCost) });
          } else if (movement.type === 'OUT') {
            let remaining = movement.quantity;
            while (remaining > 0 && queue.length > 0) {
              const batch = queue[0];
              const used = Math.min(batch.qty, remaining);
              batch.qty -= used;
              remaining -= used;
              if (batch.qty === 0) queue.shift();
            }
          }
        });
        totalValue = queue.reduce((sum, batch) => sum + batch.qty * batch.cost, 0);
        avgCost = item.quantityOnHand > 0 ? totalValue / item.quantityOnHand : 0;
      } else {
        // Weighted Average
        const totalCost = item.movements
          .filter((m) => m.type === 'IN')
          .reduce((sum, m) => sum + Number(m.totalCost), 0);
        const totalQty = item.movements
          .filter((m) => m.type === 'IN')
          .reduce((sum, m) => sum + m.quantity, 0);
        avgCost = totalQty > 0 ? totalCost / totalQty : 0;
        totalValue = item.quantityOnHand * avgCost;
      }

      return {
        id: item.id,
        sku: item.sku,
        name: item.name,
        category: item.category,
        quantityOnHand: item.quantityOnHand,
        averageCost: avgCost,
        totalValue: totalValue,
        valuationMethod: item.valuationMethod,
      };
    });

    const summary = {
      totalItems: valuation.length,
      totalQuantity: valuation.reduce((sum, v) => sum + v.quantityOnHand, 0),
      totalValue: valuation.reduce((sum, v) => sum + v.totalValue, 0),
      byCategory: {} as any,
    };

    valuation.forEach((item) => {
      const cat = item.category || 'Uncategorized';
      if (!summary.byCategory[cat]) {
        summary.byCategory[cat] = { count: 0, value: 0 };
      }
      summary.byCategory[cat].count++;
      summary.byCategory[cat].value += item.totalValue;
    });

    res.json({
      success: true,
      data: {
        summary,
        items: valuation,
      },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Failed to generate inventory valuation',
      error: error.message,
    });
  }
};

// ===== FX REVALUATION =====
export const getFXRevaluation = async (req: Request, res: Response) => {
  try {
    const { currency, asOfDate } = req.query;
    const targetCurrency = (currency as string) || 'USD';
    const date = asOfDate ? new Date(asOfDate as string) : new Date();

    // Get latest exchange rates
    const rates = await prisma.exchangeRate.findMany({
      where: {
        date: { lte: date },
        toCurrency: targetCurrency,
      },
      orderBy: {
        date: 'desc',
      },
      distinct: ['fromCurrency'],
    });

    // Get foreign currency accounts (AR, AP, Cash)
    const arInvoices = await prisma.aRInvoice.findMany({
      where: {
        status: { in: ['SENT', 'PARTIAL', 'OVERDUE'] },
        currency: { not: targetCurrency },
      },
      include: { payments: true },
    });

    const apBills = await prisma.aPBill.findMany({
      where: {
        status: { in: ['UNPAID', 'PARTIAL'] },
        currency: { not: targetCurrency },
      },
      include: { payments: true },
    });

    const rateMap = new Map();
    rates.forEach((r) => rateMap.set(r.fromCurrency, Number(r.rate)));

    const revaluation = {
      arRevaluation: [] as any[],
      apRevaluation: [] as any[],
      totalUnrealizedGain: 0,
      totalUnrealizedLoss: 0,
    };

    // AR Revaluation
    arInvoices.forEach((inv) => {
      const rate = rateMap.get(inv.currency) || 1;
      const paidAmount = inv.payments.reduce((sum, p) => sum + Number(p.amount), 0);
      const outstanding = Number(inv.totalAmount) - paidAmount;
      const originalValue = outstanding; // Assume 1:1 at booking
      const revaluedValue = outstanding * rate;
      const gain = revaluedValue - originalValue;

      revaluation.arRevaluation.push({
        invoiceId: inv.id,
        invoiceNumber: inv.invoiceNumber,
        currency: inv.currency,
        outstanding,
        rate,
        revaluedValue,
        unrealizedGain: gain,
      });

      if (gain > 0) revaluation.totalUnrealizedGain += gain;
      else revaluation.totalUnrealizedLoss += Math.abs(gain);
    });

    // AP Revaluation
    apBills.forEach((bill) => {
      const rate = rateMap.get(bill.currency) || 1;
      const paidAmount = bill.payments.reduce((sum, p) => sum + Number(p.amount), 0);
      const outstanding = Number(bill.totalAmount) - paidAmount;
      const originalValue = outstanding;
      const revaluedValue = outstanding * rate;
      const gain = originalValue - revaluedValue; // Reversed for liabilities

      revaluation.apRevaluation.push({
        billId: bill.id,
        billNumber: bill.billNumber,
        currency: bill.currency,
        outstanding,
        rate,
        revaluedValue,
        unrealizedGain: gain,
      });

      if (gain > 0) revaluation.totalUnrealizedGain += gain;
      else revaluation.totalUnrealizedLoss += Math.abs(gain);
    });

    const netGain = revaluation.totalUnrealizedGain - revaluation.totalUnrealizedLoss;

    res.json({
      success: true,
      data: {
        asOfDate: date,
        targetCurrency,
        revaluation: {
          ...revaluation,
          netUnrealizedGain: netGain,
        },
      },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Failed to generate FX revaluation',
      error: error.message,
    });
  }
};

// ===== CONSOLIDATED FINANCIALS =====
export const getConsolidatedFinancials = async (req: Request, res: Response) => {
  try {
    const { startDate, endDate } = req.query;

    const start = startDate ? new Date(startDate as string) : new Date(new Date().getFullYear(), 0, 1);
    const end = endDate ? new Date(endDate as string) : new Date();

    // Get all stores
    const stores = await prisma.shopifyStore.findMany({
      where: { isActive: true },
    });

    // Get consolidated journal entries
    const entries = await prisma.journalEntry.findMany({
      where: {
        date: { gte: start, lte: end },
        isPosted: true,
      },
      include: {
        lines: {
          include: {
            account: true,
          },
        },
      },
    });

    // Consolidate by account type
    const consolidated = {
      assets: 0,
      liabilities: 0,
      equity: 0,
      revenue: 0,
      expenses: 0,
    };

    const accountBalances = new Map();

    entries.forEach((entry) => {
      entry.lines.forEach((line) => {
        const account = line.account;
        const balance = Number(line.debit) - Number(line.credit);

        accountBalances.set(
          account.id,
          (accountBalances.get(account.id) || 0) + balance
        );

        switch (account.type) {
          case 'ASSET':
            consolidated.assets += balance;
            break;
          case 'LIABILITY':
            consolidated.liabilities += Math.abs(balance);
            break;
          case 'EQUITY':
            consolidated.equity += Math.abs(balance);
            break;
          case 'REVENUE':
            consolidated.revenue += Math.abs(balance);
            break;
          case 'EXPENSE':
            consolidated.expenses += balance;
            break;
        }
      });
    });

    const netIncome = consolidated.revenue - consolidated.expenses;

    res.json({
      success: true,
      data: {
        period: { start, end },
        stores: stores.length,
        balanceSheet: {
          assets: consolidated.assets,
          liabilities: consolidated.liabilities,
          equity: consolidated.equity + netIncome,
        },
        incomeStatement: {
          revenue: consolidated.revenue,
          expenses: consolidated.expenses,
          netIncome,
        },
      },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Failed to generate consolidated financials',
      error: error.message,
    });
  }
};

