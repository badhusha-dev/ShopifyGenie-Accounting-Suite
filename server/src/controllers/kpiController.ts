import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// ===== KPI SUMMARY =====
export const getKPISummary = async (req: Request, res: Response) => {
  try {
    const { period } = req.query; // today, week, month, year

    let startDate = new Date();
    const endDate = new Date();

    switch (period) {
      case 'today':
        startDate.setHours(0, 0, 0, 0);
        break;
      case 'week':
        startDate.setDate(startDate.getDate() - 7);
        break;
      case 'month':
        startDate.setMonth(startDate.getMonth() - 1);
        break;
      case 'year':
        startDate.setFullYear(startDate.getFullYear() - 1);
        break;
      default:
        startDate.setMonth(startDate.getMonth() - 1); // Default to last month
    }

    // Get revenue
    const revenueEntries = await prisma.journalLine.findMany({
      where: {
        account: {
          type: 'REVENUE',
        },
        journalEntry: {
          date: { gte: startDate, lte: endDate },
          isPosted: true,
        },
      },
      include: {
        account: true,
      },
    });

    const totalRevenue = revenueEntries.reduce(
      (sum, line) => sum + Number(line.credit) - Number(line.debit),
      0
    );

    // Get expenses
    const expenseEntries = await prisma.journalLine.findMany({
      where: {
        account: {
          type: 'EXPENSE',
        },
        journalEntry: {
          date: { gte: startDate, lte: endDate },
          isPosted: true,
        },
      },
      include: {
        account: true,
      },
    });

    const totalExpenses = expenseEntries.reduce(
      (sum, line) => sum + Number(line.debit) - Number(line.credit),
      0
    );

    // Get COGS
    const cogsEntries = expenseEntries.filter((e) =>
      e.account.name.toLowerCase().includes('cogs')
    );
    const totalCOGS = cogsEntries.reduce(
      (sum, line) => sum + Number(line.debit) - Number(line.credit),
      0
    );

    // Calculate margins
    const grossProfit = totalRevenue - totalCOGS;
    const grossMargin = totalRevenue > 0 ? (grossProfit / totalRevenue) * 100 : 0;
    const netIncome = totalRevenue - totalExpenses;
    const netMargin = totalRevenue > 0 ? (netIncome / totalRevenue) * 100 : 0;

    // Get orders
    const orders = await prisma.shopifyOrder.findMany({
      where: {
        processedAt: { gte: startDate, lte: endDate },
      },
    });

    const totalOrders = orders.length;
    const totalOrderValue = orders.reduce((sum, order) => sum + Number(order.totalPrice), 0);
    const averageOrderValue = totalOrders > 0 ? totalOrderValue / totalOrders : 0;

    // Get refunds
    const refunds = await prisma.shopifyRefund.findMany({
      where: {
        createdAt: { gte: startDate, lte: endDate },
      },
    });

    const totalRefunds = refunds.reduce((sum, refund) => sum + Number(refund.amount), 0);
    const refundRatio = totalRevenue > 0 ? (totalRefunds / totalRevenue) * 100 : 0;

    // Get top customers
    const customerOrders = new Map();
    orders.forEach((order) => {
      if (order.customerEmail) {
        const current = customerOrders.get(order.customerEmail) || { count: 0, value: 0 };
        current.count += 1;
        current.value += Number(order.totalPrice);
        customerOrders.set(order.customerEmail, current);
      }
    });

    const topCustomers = Array.from(customerOrders.entries())
      .map(([email, data]) => ({ email, ...data }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 10);

    // Get Shopify fees (from expense accounts)
    const feeEntries = expenseEntries.filter((e) =>
      e.account.name.toLowerCase().includes('shopify') ||
      e.account.name.toLowerCase().includes('fee')
    );
    const totalFees = feeEntries.reduce(
      (sum, line) => sum + Number(line.debit) - Number(line.credit),
      0
    );

    const kpis = {
      period: { start: startDate, end: endDate, label: period || 'month' },
      revenue: {
        total: totalRevenue,
        gross: grossProfit,
        net: netIncome,
      },
      margins: {
        gross: grossMargin,
        net: netMargin,
      },
      expenses: {
        total: totalExpenses,
        cogs: totalCOGS,
        fees: totalFees,
      },
      orders: {
        total: totalOrders,
        value: totalOrderValue,
        average: averageOrderValue,
      },
      refunds: {
        total: totalRefunds,
        ratio: refundRatio,
      },
      topCustomers,
    };

    res.json({
      success: true,
      data: kpis,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Failed to generate KPI summary',
      error: error.message,
    });
  }
};

// ===== SALES TRENDS =====
export const getSalesTrends = async (req: Request, res: Response) => {
  try {
    const { period, groupBy } = req.query; // period: week, month, year | groupBy: day, week, month

    let startDate = new Date();
    const endDate = new Date();

    switch (period) {
      case 'week':
        startDate.setDate(startDate.getDate() - 7);
        break;
      case 'month':
        startDate.setMonth(startDate.getMonth() - 1);
        break;
      case 'year':
        startDate.setFullYear(startDate.getFullYear() - 1);
        break;
      default:
        startDate.setMonth(startDate.getMonth() - 1);
    }

    const orders = await prisma.shopifyOrder.findMany({
      where: {
        processedAt: { gte: startDate, lte: endDate },
      },
      orderBy: {
        processedAt: 'asc',
      },
    });

    // Group by time period
    const trends = new Map();

    orders.forEach((order) => {
      if (!order.processedAt) return;

      let key = '';
      const date = new Date(order.processedAt);

      switch (groupBy) {
        case 'day':
          key = date.toISOString().split('T')[0];
          break;
        case 'week':
          const weekStart = new Date(date);
          weekStart.setDate(date.getDate() - date.getDay());
          key = weekStart.toISOString().split('T')[0];
          break;
        case 'month':
          key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
          break;
        default:
          key = date.toISOString().split('T')[0];
      }

      if (!trends.has(key)) {
        trends.set(key, {
          period: key,
          orders: 0,
          revenue: 0,
          tax: 0,
          avgOrderValue: 0,
        });
      }

      const data = trends.get(key);
      data.orders += 1;
      data.revenue += Number(order.totalPrice);
      data.tax += Number(order.totalTax);
    });

    // Calculate averages
    const trendData = Array.from(trends.values()).map((item) => ({
      ...item,
      avgOrderValue: item.orders > 0 ? item.revenue / item.orders : 0,
    }));

    res.json({
      success: true,
      data: {
        period: { start: startDate, end: endDate },
        groupBy: groupBy || 'day',
        trends: trendData,
      },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Failed to generate sales trends',
      error: error.message,
    });
  }
};

// ===== TOP PRODUCTS =====
export const getTopProducts = async (req: Request, res: Response) => {
  try {
    const { period, limit } = req.query;

    let startDate = new Date();
    const endDate = new Date();

    switch (period) {
      case 'week':
        startDate.setDate(startDate.getDate() - 7);
        break;
      case 'month':
        startDate.setMonth(startDate.getMonth() - 1);
        break;
      case 'year':
        startDate.setFullYear(startDate.getFullYear() - 1);
        break;
      default:
        startDate.setMonth(startDate.getMonth() - 1);
    }

    // Note: This is a simplified version. In production, you'd have a products/line_items table
    const orders = await prisma.shopifyOrder.findMany({
      where: {
        processedAt: { gte: startDate, lte: endDate },
      },
    });

    // Group by customer (as proxy for products in this example)
    const productMap = new Map();
    orders.forEach((order) => {
      const key = order.customerId || 'unknown';
      if (!productMap.has(key)) {
        productMap.set(key, {
          productId: key,
          quantity: 0,
          revenue: 0,
          orders: 0,
        });
      }
      const product = productMap.get(key);
      product.quantity += 1;
      product.revenue += Number(order.totalPrice);
      product.orders += 1;
    });

    const topProducts = Array.from(productMap.values())
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, parseInt((limit as string) || '10'));

    res.json({
      success: true,
      data: {
        period: { start: startDate, end: endDate },
        topProducts,
      },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Failed to get top products',
      error: error.message,
    });
  }
};

