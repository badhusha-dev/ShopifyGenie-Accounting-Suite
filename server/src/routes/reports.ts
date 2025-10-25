import { Router } from 'express';
import {
  getTrialBalance,
  getProfitLoss,
  getBalanceSheet,
  getTaxSummary,
  getDashboardStats,
  getCashFlow,
  getTaxSummaryCtrl,
  getExpenseBreakdownCtrl,
  getRevenueBreakdownCtrl,
} from '../controllers/reportsController';
import { authenticate, requireRoleOrHigher } from '../middleware/auth';
import { UserRole } from '@shopifygenie/shared';

const router = Router();

// All routes require authentication
router.use(authenticate);

// Dashboard stats (available to all authenticated users)
router.get('/dashboard', getDashboardStats);

// Financial reports (require accounting role or higher)
router.get('/trial-balance', requireRoleOrHigher('ACCOUNTING'), getTrialBalance);
router.get('/pnl', requireRoleOrHigher('ACCOUNTING'), getProfitLoss);
router.get('/profit-loss', requireRoleOrHigher('ACCOUNTING'), getProfitLoss); // Alias
router.get('/balance-sheet', requireRoleOrHigher('ACCOUNTING'), getBalanceSheet);
router.get('/tax-summary', requireRoleOrHigher('ACCOUNTING'), getTaxSummary);

// Advanced reports (require accounting role or higher)
router.get('/cashflow', requireRoleOrHigher('ACCOUNTING'), getCashFlow);
router.get('/cash-flow', requireRoleOrHigher('ACCOUNTING'), getCashFlow); // Alias
router.get('/tax', requireRoleOrHigher('ACCOUNTING'), getTaxSummaryCtrl);
router.get('/expense-breakdown', requireRoleOrHigher('ACCOUNTING'), getExpenseBreakdownCtrl);
router.get('/expenses', requireRoleOrHigher('ACCOUNTING'), getExpenseBreakdownCtrl); // Alias
router.get('/revenue-breakdown', requireRoleOrHigher('ACCOUNTING'), getRevenueBreakdownCtrl);
router.get('/revenue', requireRoleOrHigher('ACCOUNTING'), getRevenueBreakdownCtrl); // Alias

export default router;
